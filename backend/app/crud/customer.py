from sqlalchemy.orm import Session

from app.core.exceptions import DuplicateException, NotFoundException
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    existing = db.query(Customer).filter(Customer.email == payload.email).first()
    if existing:
        raise DuplicateException(f"Customer with email '{payload.email}' already exists")

    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def get_customers(db: Session, skip: int = 0, limit: int = 100) -> list[Customer]:
    return db.query(Customer).order_by(Customer.id).offset(skip).limit(limit).all()


def get_customer(db: Session, customer_id: int) -> Customer:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise NotFoundException("Customer", customer_id)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer(db, customer_id)
    db.delete(customer)
    db.commit()
