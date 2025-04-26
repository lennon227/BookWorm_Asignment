from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.security import verify_password, create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.token import Token
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Kiểm tra user có tồn tại và mật khẩu có chính xác không
    if not user or not verify_password(form_data.password, user.password):
        # Nếu không tìm thấy user hoặc mật khẩu không khớp, trả về lỗi 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
        )
    
    # Nếu xác thực thành công, tạo access token với thông tin user ID
    access_token = create_access_token(
        data={"sub": str(user.id)},  # Đưa user ID vào payload token 
        expires_delta=timedelta(minutes=60),
    )
    return {"access_token": access_token, "token_type": "bearer"}