from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional


# Schema tạo review mới
class ReviewCreate(BaseModel):
    book_id: int
    review_title: str = Field(..., max_length=120)
    review_details: Optional[str] = None
    rating_start: int

# Schema trả về review
class ReviewRead(BaseModel):
    id: int
    book_id: int
    review_title: str
    review_details: Optional[str] = None
    review_date: datetime
    rating_start: int

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)