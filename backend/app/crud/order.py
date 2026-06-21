from sqlalchemy.orm import Session, joinedload

from app.core.exceptions import InsufficientStockException, NotFoundException
from app.crud.customer import get_customer
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate


def create_order(db: Session, payload: OrderCreate) -> Order:
    """
    Creates an order alongside its line items, validating stock for every
    item *before* writing anything, then atomically deducting stock and
    computing the total. All of this happens in one DB transaction: if
    anything fails, nothing is committed, so stock and totals never drift.
    """
    # Confirms the customer exists; raises NotFoundException otherwise.
    get_customer(db, payload.customer_id)

    # Lock-free pre-check pass: validate every line item has enough stock
    # before mutating anything, and resolve products once for reuse below.
    products_by_id: dict[int, Product] = {}
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise NotFoundException("Product", item.product_id)
        if product.quantity_in_stock < item.quantity:
            raise InsufficientStockException(
                product_name=product.name,
                requested=item.quantity,
                available=product.quantity_in_stock,
            )
        products_by_id[item.product_id] = product

    order = Order(customer_id=payload.customer_id, total_amount=0, status="confirmed")
    db.add(order)
    db.flush()  # assigns order.id without committing yet

    total_amount = 0
    for item in payload.items:
        product = products_by_id[item.product_id]

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.price,
        )
        db.add(order_item)

        # Automatic stock deduction.
        product.quantity_in_stock -= item.quantity

        total_amount += product.price * item.quantity

    # Automatic total calculation -- never trust a client-supplied total.
    order.total_amount = total_amount

    db.commit()
    db.refresh(order)
    return order


def get_orders(db: Session, skip: int = 0, limit: int = 100) -> list[Order]:
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_order(db: Session, order_id: int) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise NotFoundException("Order", order_id)
    return order


def delete_order(db: Session, order_id: int, restock: bool = True) -> None:
    """
    Cancels/deletes an order. By default restocks the products, since an
    order being cancelled should release the inventory it was holding.
    """
    order = get_order(db, order_id)

    if restock:
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.quantity_in_stock += item.quantity

    db.delete(order)
    db.commit()
