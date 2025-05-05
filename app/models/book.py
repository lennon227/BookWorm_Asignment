from sqlalchemy import Column, String, Text, Numeric, ForeignKey, BigInteger
from sqlalchemy.orm import relationship

from .base import BaseModel

class Book(BaseModel):
    __tablename__ = "book"
    
    category_id = Column(BigInteger, ForeignKey("category.id"), nullable=False)
    author_id = Column(BigInteger, ForeignKey("author.id"), nullable=False)
    book_title = Column(String(255), nullable=False)
    book_summary = Column(Text)
    book_price = Column(Numeric(5, 2), nullable=False)
    book_cover_photo = Column(String(255))
    
    category = relationship("Category", back_populates="books")
    author = relationship("Author", back_populates="books")
    reviews = relationship("Review", back_populates="book")
    discounts = relationship("Discount", back_populates="book")
    order_items = relationship("OrderItem", back_populates="book")