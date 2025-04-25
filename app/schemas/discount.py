from pydantic import BaseModel, ConfigDict
from datetime import date
from decimal import Decimal


# Schema tạo discount mới
class DiscountCreate(BaseModel):
    book_id: int
    discount_start_date: date
    discount_end_date: date
    discount_price: Decimal


# Schema trả về discount
class DiscountRead(BaseModel):
    id: int
    book_id: int
    discount_start_date: date
    discount_end_date: date
    discount_price: Decimal

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)