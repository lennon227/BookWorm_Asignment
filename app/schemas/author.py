from pydantic import BaseModel, Field, ConfigDict

# Schema để tạo author mới - dùng cho seed
class AuthorCreate(BaseModel):
    author_name: str = Field(..., max_length=255)
    author_bio: str | None = None


# Schema trả về thông tin author
class AuthorRead(BaseModel):
    id: int
    author_name: str
    author_bio: str | None = None

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)