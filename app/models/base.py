from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, BigInteger

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True
    
    id = Column(BigInteger, primary_key=True, index=True)