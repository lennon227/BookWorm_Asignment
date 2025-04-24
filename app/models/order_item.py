from sqlalchemy import Column, SmallInteger, Numeric, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from .base import BaseModel

class OrderItem(BaseModel):
    __tablename__ = "order_item"
    
    order_id = Column(BigInteger, ForeignKey("order.id"), nullable=False)
    book_id = Column(BigInteger, ForeignKey("book.id"), nullable=False)
    quantity = Column(SmallInteger, nullable=False)
    price = Column(Numeric(5, 2), nullable=False)
    
    order = relationship("Order", back_populates="order_items")
    book = relationship("Book", back_populates="order_items")