from sqlalchemy import Column, String
from sqlalchemy.orm import relationship

from .base import BaseModel

class Category(BaseModel):
    __tablename__ = "category"
    
    category_name = Column(String(120), nullable=False, unique=True)
    category_desc = Column(String(255))
    
    books = relationship("Book", back_populates="category")