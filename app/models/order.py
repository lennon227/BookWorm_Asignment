from sqlalchemy import Column, Integer, Numeric, ForeignKey, BigInteger, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import BaseModel

class Order(BaseModel):
    __tablename__ = "order"
    
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    order_date = Column(DateTime, default=func.now())
    order_amount = Column(Numeric(8, 2), nullable=False)
    
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")