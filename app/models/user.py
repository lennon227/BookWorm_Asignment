from sqlalchemy import Column, String, Boolean, Integer
from sqlalchemy.orm import relationship

from .base import BaseModel

class User(BaseModel):
    __tablename__ = "user"
    
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(70), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    admin = Column(Boolean, default=False)
    
    orders = relationship("Order", back_populates="user")