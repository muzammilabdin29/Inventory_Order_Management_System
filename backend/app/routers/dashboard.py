from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.crud.product import get_low_stock_products
from app.models.customer import Customer
from app.models.order import Order
from app.models.product import Product
from app.schemas.product import ProductOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

LOW_STOCK_THRESHOLD = 10


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    total_products = db.query(func.count(Product.id)).scalar()
    total_customers = db.query(func.count(Customer.id)).scalar()
    total_orders = db.query(func.count(Order.id)).scalar()
    low_stock_products = get_low_stock_products(db, threshold=LOW_STOCK_THRESHOLD)

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_threshold": LOW_STOCK_THRESHOLD,
        "low_stock_products": [ProductOut.model_validate(p) for p in low_stock_products],
    }
