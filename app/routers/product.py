from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models import Book, Review, Author, Discount
from app.schemas.book import BookIDDetailResponse
from app.schemas.review import ReviewRead, ReviewCreate
from sqlalchemy import func

router = APIRouter(
    prefix="/product",
    tags=["product"]
)


@router.get("/{book_id}", response_model=BookIDDetailResponse)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):    
    today = date.today()
    # Lấy ngày hiện tại để kiểm tra các khuyến mãi đang hoạt động
    book = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Book.book_summary,  # Bổ sung trường summary cho chi tiết sách
            Author.author_name,
            Book.book_price.label("price"),
            func.coalesce(
                # Subquery lấy giá khuyến mãi thấp nhất đang áp dụng
                db.query(Discount.discount_price)
                .filter(Discount.book_id == Book.id)
                .filter(Discount.discount_start_date <= today)
                .filter(Discount.discount_end_date >= today)
                .order_by(Discount.discount_price.asc())  # Lấy mức giá khuyến mãi thấp nhất
                .limit(1)
                .scalar_subquery(),
                None
            ).label("discount_price"),
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)  # Join với bảng Author để lấy tên tác giả
        .filter(Book.id == book_id)  # Lọc theo ID sách
        .first() 
    )
    
    # Kiểm tra nếu không tìm thấy sách với ID cung cấp
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Lấy danh sách đánh giá của sách
    reviews = (
        db.query(Review)
        .filter(Review.book_id == book_id)
        .order_by(Review.review_date.desc())  # Sắp xếp theo thời gian đánh giá mới nhất
        .all()
    )
    
    # Chuyển đổi các đối tượng Review thành đối tượng Pydantic ReviewRead
    review_data = [ReviewRead.from_orm(r) for r in reviews]
    
    # Tạo và trả về đối tượng phản hồi với đầy đủ thông tin sách và đánh giá
    return BookIDDetailResponse(
        book_id=book.book_id,
        book_title=book.book_title,
        book_summary=book.book_summary,
        author_name=book.author_name,
        price=book.price,
        discount_price=book.discount_price,
        image=book.image,
        reviews=review_data
    )

@router.post("/{book_id}/reviews", response_model=ReviewRead)
def create_review(book_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    
    # Tạo đối tượng Review mới từ dữ liệu nhận được
    db_review = Review(
        review_title=review.review_title,
        review_details=review.review_details,
        rating_start=review.rating_start,
        book_id=book_id, 
    )
    
    # Thêm đánh giá vào cơ sở dữ liệu
    db.add(db_review)
    db.commit()
    db.refresh(db_review)  # Refresh để cập nhật theo ID
    
    return db_review