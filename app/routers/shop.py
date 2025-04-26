from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, Numeric
from typing import Optional
from datetime import date
from enum import Enum

from app.db.session import get_db
from app.models.book import Book
from app.models.author import Author
from app.models.discount import Discount
from app.models.category import Category
from app.models.review import Review
from app.schemas.book import BookListResponse

router = APIRouter(
    prefix="/shop",
    tags=["shop"]
)

# Enum cho các giá trị limit được phép
class LimitOptions(int, Enum):
    five = 5
    fifteen = 15
    twenty = 20
    twentyfive = 25

# Enum cho các giá trị rating được phép
class RatingOptions(int, Enum):
    one = 1
    two = 2
    three = 3
    four = 4
    five = 5

@router.get("/books", response_model=BookListResponse)
def get_all_books(
    skip: int = Query(0, ge=0),
    limit: LimitOptions = Query(LimitOptions.twenty),
    category_name: Optional[str] = None,
    author_name: Optional[str] = None,
    rating: Optional[RatingOptions] = None,
    sort: Optional[str] = Query("on_sale", description="Options: on_sale, popularity, price_asc, price_desc"),
    db: Session = Depends(get_db)
):
    today = date.today()

    # Subquery
    avg_ratings = (
        db.query(
            Review.book_id,
            func.avg(func.cast(Review.rating_start, Numeric)).label("avg_rating"),
            func.count(Review.id).label("review_count")
        )
        .group_by(Review.book_id)
        .subquery()
    )

    current_discounts = (
        db.query(
            Discount.book_id,
            Discount.discount_price,
            (Book.book_price - Discount.discount_price).label("sub_price")
        )
        .join(Book, Discount.book_id == Book.id)
        .filter(Discount.discount_start_date <= today)
        .filter(Discount.discount_end_date >= today)
        .subquery()
    )

    # Query chính
    base_query = (
        db.query(
            Book.id.label("book_id"),
            Book.book_title,
            Author.author_name,
            Category.category_name,
            Book.book_price.label("price"),
            current_discounts.c.discount_price,
            func.coalesce(current_discounts.c.discount_price, Book.book_price).label("final_price"),
            current_discounts.c.sub_price,
            func.coalesce(avg_ratings.c.avg_rating, 0).label("avg_rating"),
            func.coalesce(avg_ratings.c.review_count, 0).label("review_count"),
            Book.book_cover_photo.label("image")
        )
        .join(Author, Book.author_id == Author.id)
        .join(Category, Book.category_id == Category.id)
        .outerjoin(current_discounts, Book.id == current_discounts.c.book_id)
        .outerjoin(avg_ratings, Book.id == avg_ratings.c.book_id)
    )

    # Filtering
    if category_name:
        base_query = base_query.filter(Category.category_name == category_name)
    if author_name:
        base_query = base_query.filter(Author.author_name == author_name)
    if rating is not None:
        base_query = base_query.filter(func.coalesce(avg_ratings.c.avg_rating, 0) >= float(rating))

    # Lấy total sách để phân trang
    total = base_query.count()

    # Sorting
    if sort == "on_sale":
        base_query = base_query.order_by(
            desc(func.coalesce(current_discounts.c.sub_price, 0)),
            asc("final_price")
        )
    elif sort == "popularity":
        base_query = base_query.order_by(
            desc(func.coalesce(avg_ratings.c.review_count, 0)),
            asc("final_price")
        )
    elif sort == "price_asc":
        base_query = base_query.order_by(asc("final_price"))
    elif sort == "price_desc":
        base_query = base_query.order_by(desc("final_price"))
    else:
        base_query = base_query.order_by(
            desc(func.coalesce(current_discounts.c.sub_price, 0)),
            asc("final_price")
        )

    # Phân trang
    books = base_query.offset(skip).limit(limit.value).all()

    # Format kết quả
    result = [
        {
            "book_id": book.book_id,
            "book_title": book.book_title,
            "author_name": book.author_name,
            "price": book.price,
            "discount_price": book.discount_price,
            "image": book.image
        }
        for book in books
    ]

    return {"books": result, "total": total}


# Lấy danh sách danh mục để lọc
@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = (
        db.query(Category.category_name)
        .order_by(Category.category_name)
        .all()
    )
    
    return [{"name": cat.category_name} for cat in categories]

# Lấy danh sách tác giả để lọc
@router.get("/authors")
def get_authors(db: Session = Depends(get_db)):
    authors = (
        db.query(Author.author_name)
        .order_by(Author.author_name)
        .all()
    )
    
    return [{"name": author.author_name} for author in authors]

# Lấy các giá trị limit có thể chọn
@router.get("/limits")
def get_limit_options():
    return [
        {"value": 5, "label": "Show 5"},
        {"value": 15, "label": "Show 15"},
        {"value": 20, "label": "Show 20"},
        {"value": 25, "label": "Show 25"}
    ]

# Lấy các mức xếp hạng có thể lọc
@router.get("/ratings")
def get_rating_filters():
    return [
        {"value": 1, "label": "1 star"},
        {"value": 2, "label": "2 star"},
        {"value": 3, "label": "3 star"},
        {"value": 4, "label": "4 star"},
        {"value": 5, "label": "5 star"}
    ]