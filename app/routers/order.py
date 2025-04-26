from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.order import OrderCreate, OrderRead
from app.models import Book, Order, OrderItem
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/orders", response_model=OrderRead)
def create_order(order: OrderCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):    
    # Kiểm tra các sản phẩm trong đơn hàng
    unavailable_items = []
    for item in order.order_items:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if not book:
            # Nếu không tìm thấy sách, thêm vào danh sách sản phẩm không khả dụng
            unavailable_items.append({"id": item.book_id, "title": "Unknown"})
    
    # Nếu có sản phẩm không khả dụng, trả về lỗi 400 Bad Request
    if unavailable_items:
        raise HTTPException(
            status_code=400,
            detail="Unavailable items", 
            headers={"X-Unavailable": str(unavailable_items)}
        )
    
    # Tạo đơn hàng mới trong cơ sở dữ liệu
    new_order = Order(
        user_id=current_user.id,  # Lấy ID người dùng từ token xác thực
        order_amount=order.order_amount  # Tổng giá trị đơn hàng
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)  # Refresh để lấy ID của đơn hàng mới tạo
    
    # Thêm từng sản phẩm vào chi tiết đơn hàng
    for item in order.order_items:
        db_item = OrderItem(
            order_id=new_order.id,
            book_id=item.book_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    
    # Lưu tất cả chi tiết đơn hàng
    db.commit()
    db.refresh(new_order)  # Refresh để lấy dữ liệu mới nhất bao gồm các items

    return new_order