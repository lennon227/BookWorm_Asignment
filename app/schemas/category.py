from pydantic import BaseModel, Field, ConfigDict

# Schema để tạo category mới
class CategoryCreate(BaseModel):
    category_name: str = Field(..., max_length=120)
    category_desc: str | None = Field(None, max_length=255)


# Schema trả về category
class CategoryRead(BaseModel):
    id: int
    category_name: str
    category_desc: str | None = None

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)