from sqlalchemy.orm import Session

from app.core.exceptions import DuplicateException, NotFoundException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(db: Session, payload: ProductCreate) -> Product:
    existing = db.query(Product).filter(Product.sku == payload.sku).first()
    if existing:
        raise DuplicateException(f"Product with SKU '{payload.sku}' already exists")

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_products(db: Session, skip: int = 0, limit: int = 100) -> list[Product]:
    return db.query(Product).order_by(Product.id).offset(skip).limit(limit).all()


def get_product(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException("Product", product_id)
    return product


def update_product(db: Session, product_id: int, payload: ProductUpdate) -> Product:
    product = get_product(db, product_id)

    update_data = payload.model_dump(exclude_unset=True)

    new_sku = update_data.get("sku")
    if new_sku and new_sku != product.sku:
        clash = db.query(Product).filter(Product.sku == new_sku, Product.id != product_id).first()
        if clash:
            raise DuplicateException(f"Product with SKU '{new_sku}' already exists")

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)
    db.delete(product)
    db.commit()


def get_low_stock_products(db: Session, threshold: int = 10) -> list[Product]:
    return db.query(Product).filter(Product.quantity_in_stock <= threshold).order_by(Product.quantity_in_stock).all()
