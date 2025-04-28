from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from sqlalchemy import Numeric
from typing import List
from datetime import date

from app.db.session import get_db
from app.models.book import Book
from app.models.author import Author
from app.models.discount import Discount
from app.schemas.book import BookDetailResponse
from app.models.review import Review

router = APIRouter(
    prefix="/books",
    tags=["books"]
)

# Lấy 20 quyển sách
@router.get("/", response_model=List[BookDetailResponse])
def get_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Lấy ngày hiện tại cho việc kiểm tra giảm giá
    today = date.today()
    
    # Query để lấy thông tin sách kèm theo thông tin tác giả
    books = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Book.book_price.label("price"),
            func.coalesce(
                # Lấy giá giảm nếu hôm nay nằm trong khoảng thời gian giảm giá
                db.query(Discount.discount_price)
                .filter(Discount.book_id == Book.id)
                .filter(Discount.discount_start_date <= today)
                .filter(Discount.discount_end_date >= today)
                .order_by(Discount.discount_price.asc())  # Lấy mức giảm giá thấp nhất nếu có nhiều
                .limit(1)
                .scalar_subquery(),
                None
            ).label("discount_price"),
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    # Chuyển đổi kết quả từ SQLAlchemy Row thành dict để phù hợp với schema
    result = []
    for book in books:
        book_dict = {
            "book_id": book.book_id,
            "book_title": book.book_title,
            "author_name": book.author_name,
            "price": book.price,
            "discount_price": book.discount_price,
            "image": book.image
        }
        result.append(book_dict)
    
    return result


# Lấy sales book
@router.get("/top-sales", response_model=List[BookDetailResponse])
def get_top_sale_books(db: Session = Depends(get_db)):
    today = date.today()
    
    # Query lấy sách có discount và tính sub_price
    books_on_sale = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Book.book_price.label("price"),
            Discount.discount_price.label("discount_price"),
            (Book.book_price - Discount.discount_price).label("sub_price"),
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .join(Discount, Book.id == Discount.book_id)
        .filter(Discount.discount_start_date <= today)
        .filter(Discount.discount_end_date >= today)
        .filter(Discount.discount_price < Book.book_price)  # Đảm bảo discount thực sự giảm giá
        .order_by(desc("sub_price"))  # Sắp xếp theo mức giảm giá cao nhất
        .limit(10)
        .all()
    )
    
    if not books_on_sale:
        raise HTTPException(status_code=404, detail="NO BOOK SALES")
    
    # Chuyển đổi kết quả thành list các dict
    result = []
    for book in books_on_sale:
        book_dict = {
            "book_id": book.book_id,
            "book_title": book.book_title,
            "author_name": book.author_name,
            "price": book.price,
            "discount_price": book.discount_price,
            "image": book.image
        }
        result.append(book_dict)
    
    return result

# Lấy recommended_books
@router.get("/recommended", response_model=List[BookDetailResponse])
def get_recommended_books(db: Session = Depends(get_db)):
    today = date.today()
    
    # Subquery để tính rating trung bình cho mỗi sách
    avg_ratings = (
        db.query(
            Review.book_id,
            func.avg(func.cast(Review.rating_start, Numeric)).label("avg_rating")
        )
        .group_by(Review.book_id)
        .subquery()
    )
    
    # Subquery để lấy giá khuyến mãi hiện tại (nếu có)
    current_discounts = (
        db.query(
            Discount.book_id,
            Discount.discount_price
        )
        .filter(Discount.discount_start_date <= today)
        .filter(Discount.discount_end_date >= today)
        .subquery()
    )
    
    # Query chính để lấy sách với rating cao nhất và giá thấp nhất
    recommended_books = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Book.book_price.label("price"),
            current_discounts.c.discount_price,
            func.coalesce(current_discounts.c.discount_price, Book.book_price).label("final_price"),
            avg_ratings.c.avg_rating,
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .join(avg_ratings, Book.id == avg_ratings.c.book_id)
        .outerjoin(current_discounts, Book.id == current_discounts.c.book_id)
        .order_by(
            desc(avg_ratings.c.avg_rating),  # Sắp xếp theo rating cao nhất trước
            func.coalesce(current_discounts.c.discount_price, Book.book_price)  # Sau đó sắp xếp theo giá thấp nhất
        )
        .limit(8)
        .all()
    )
    
    # Chuyển đổi kết quả thành list các dict
    result = []
    for book in recommended_books:
        book_dict = {
            "book_id": book.book_id,
            "book_title": book.book_title,
            "author_name": book.author_name,
            "price": book.price,
            "discount_price": book.discount_price,
            "image": book.image
        }
        result.append(book_dict)
    
    return result

# Lấy popular book
@router.get("/popular", response_model=List[BookDetailResponse])
def get_popular_books(db: Session = Depends(get_db)):
    today = date.today()
    
    # Subquery để đếm số lượng review cho mỗi sách
    review_counts = (
        db.query(
            Review.book_id,
            func.count(Review.id).label("review_count")
        )
        .group_by(Review.book_id)
        .subquery()
    )
    
    # Subquery để lấy giá khuyến mãi hiện tại (nếu có)
    current_discounts = (
        db.query(
            Discount.book_id,
            Discount.discount_price
        )
        .filter(Discount.discount_start_date <= today)
        .filter(Discount.discount_end_date >= today)
        .subquery()
    )
    
    # Query chính để lấy sách có nhiều review nhất và giá thấp nhất
    popular_books = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Book.book_price.label("price"),
            current_discounts.c.discount_price,
            func.coalesce(current_discounts.c.discount_price, Book.book_price).label("final_price"),
            review_counts.c.review_count,
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .join(review_counts, Book.id == review_counts.c.book_id)
        .outerjoin(current_discounts, Book.id == current_discounts.c.book_id)
        .order_by(
            desc(review_counts.c.review_count),  # Sắp xếp theo số lượng review nhiều nhất trước
            func.coalesce(current_discounts.c.discount_price, Book.book_price)  # Sau đó sắp xếp theo giá thấp nhất
        )
        .limit(8)
        .all()
    )
    
    # Chuyển đổi kết quả thành list các dict
    result = []
    for book in popular_books:
        book_dict = {
            "book_id": book.book_id,
            "book_title": book.book_title,
            "author_name": book.author_name,
            "price": book.price,
            "discount_price": book.discount_price,
            "image": book.image
        }
        result.append(book_dict)
    
    return result

# Lấy thông tin chi tiết của một sách theo ID
@router.get("/{book_id}", response_model=BookDetailResponse)
def get_book_by_id(book_id: int, db: Session = Depends(get_db)):
    today = date.today()
    
    # Query tương tự nhưng cho một sách cụ thể
    book = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Book.book_price.label("price"),
            func.coalesce(
                db.query(Discount.discount_price)
                .filter(Discount.book_id == Book.id)
                .filter(Discount.discount_start_date <= today)
                .filter(Discount.discount_end_date >= today)
                .order_by(Discount.discount_price.asc())
                .limit(1)
                .scalar_subquery(),
                None
            ).label("discount_price"),
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .filter(Book.id == book_id)
        .first()
    )
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Chuyển đổi kết quả thành dict
    book_dict = {
        "book_id": book.book_id,
        "book_title": book.book_title,
        "author_name": book.author_name,
        "price": book.price,
        "discount_price": book.discount_price,
        "image": book.image
    }
    
    return book_dict