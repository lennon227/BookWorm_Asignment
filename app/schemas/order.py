from pydantic import BaseModel, ConfigDict
from decimal import Decimal
from datetime import datetime
from typing import List, Optional

from app.schemas.order_item import OrderItemRead, OrderItemCreate

class OrderCreate(BaseModel):
    user_id: Optional[int] = None  
    order_amount: Decimal
    order_items: List[OrderItemCreate]

# Schema trả về Order (gồm cả OrderItem)
class OrderRead(BaseModel):
    id: int
    user_id: int
    order_date: datetime
    order_amount: Decimal
    order_items: List[OrderItemRead]

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)