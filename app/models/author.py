from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship

from .base import BaseModel

class Author(BaseModel):
    __tablename__ = "author"
    
    author_name = Column(String(255), nullable=False)
    author_bio = Column(Text)
    
    books = relationship("Book", back_populates="author")