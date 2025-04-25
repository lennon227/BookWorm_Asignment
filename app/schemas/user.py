from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Schema dùng để đăng ký user
class UserCreate(BaseModel):
    first_name: str = Field(..., max_length=50)
    last_name: str = Field(..., max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)


# Schema dùng để đăng nhập
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Schema dùng để trả về thông tin user
class UserRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    # class Config:
    #     orm_mode = True
    model_config = ConfigDict(from_attributes=True)


# Optional: Schema dùng trong DB nếu cần thao tác thêm
class UserInDB(UserRead):
    password: str