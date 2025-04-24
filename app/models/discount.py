from sqlalchemy import Column, Date, Numeric, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from .base import BaseModel

class Discount(BaseModel):
    __tablename__ = "discount"
    
    book_id = Column(BigInteger, ForeignKey("book.id"), nullable=False)
    discount_start_date = Column(Date, nullable=False)
    discount_end_date = Column(Date, nullable=False)
    discount_price = Column(Numeric(5, 2))
    
    book = relationship("Book", back_populates="discounts")