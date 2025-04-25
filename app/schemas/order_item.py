from pydantic import BaseModel, ConfigDict
from decimal import Decimal

# Schema tạo OrderItem
class OrderItemCreate(BaseModel):
    book_id: int
    quantity: int
    price: Decimal

# Schema trả về OrderItem
class OrderItemRead(BaseModel):
    id: int
    book_id: int
    quantity: int
    price: Decimal

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)