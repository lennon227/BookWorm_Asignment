from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from decimal import Decimal
from .review import ReviewRead 
from .author import AuthorRead
from .category import CategoryRead


# Schema tạo sách mới - dùng cho seed)
class BookCreate(BaseModel):
    book_title: str = Field(..., max_length=255)
    book_summary: Optional[str] = None
    book_price: Decimal
    book_cover_photo: Optional[str] = None
    category_id: int
    author_id: int


# Schema trả về thông tin sách (đơn giản, không nested)
class BookRead(BaseModel):
    id: int
    book_title: str
    book_summary: Optional[str] = None
    book_price: Decimal
    book_cover_photo: Optional[str] = None

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


# Schema mở rộng trả về sách có thông tin nested của tác giả & danh mục
class BookReadWithDetails(BookRead):
    category: CategoryRead
    author: AuthorRead
    
    
# Schema lấy đầy đủ thông tin sách

class BookDetailResponse(BaseModel):
    book_id: int
    book_title: str
    author_name: str
    price: Decimal
    discount_price: Optional[Decimal] = None
    image: Optional[str] = None

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


class BookIDDetailResponse(BaseModel):
    book_id: int
    book_title: str
    book_summary: Optional[str]
    author_name: str
    price: Decimal
    discount_price: Optional[Decimal] = None
    image: Optional[str] = None
    reviews: list[ReviewRead] = []

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)
        
        
class BookListResponse(BaseModel):
    books: List[BookDetailResponse]
    total: int