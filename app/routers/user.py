# app/routerd/user.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserRead
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user