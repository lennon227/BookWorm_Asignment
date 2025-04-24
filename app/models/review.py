from sqlalchemy import Column, String, Text, ForeignKey, BigInteger, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import BaseModel

class Review(BaseModel):
    __tablename__ = "review"
    
    book_id = Column(BigInteger, ForeignKey("book.id"), nullable=False)
    review_title = Column(String(120), nullable=False)
    review_details = Column(Text)
    review_date = Column(DateTime, default=func.now())
    rating_start = Column(Integer)
    
    book = relationship("Book", back_populates="reviews")