import random
from datetime import datetime, timedelta
from decimal import Decimal
from faker import Faker

from app.db.session import SessionLocal
from app.models import User, Category, Author, Book, Review, Discount, Order, OrderItem
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


fake = Faker()
db = SessionLocal()


def seed_users():
    created_users = []
    print("Seeding users...")

    password_raw = "12345"  # Mật khẩu mặc định
    hashed_password = pwd_context.hash(password_raw)

    for _ in range(5):
        email = fake.unique.email()
        existing_user = db.query(User).filter(User.email == email).first()
        if not existing_user:
            user = User(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=email,
                password=hashed_password,
                admin=False
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            created_users.append(user)
        else:
            created_users.append(existing_user)

    print(f"Finished seeding users. Total users (new + existing): {len(created_users)}")
    return created_users


def seed_categories():
    category_names = [
        "Fiction", "Non-fiction", "Science", "Philosophy",
        "History", "Fantasy", "Romance", "Biography"
    ]
    created_categories = []
    print("Seeding categories...")
    for name in category_names:
        existing_category = db.query(Category).filter(Category.category_name == name).first()
        if not existing_category:
            category = Category(
                category_name=name,
                category_desc=fake.sentence()
            )
            db.add(category)
            db.commit()
            db.refresh(category)
            created_categories.append(category)
        else:
            created_categories.append(existing_category) 
    print(f"Finished seeding categories. Total categories (new + existing): {len(created_categories)}")
    return created_categories


def seed_authors():
    created_authors = []
    print("Seeding authors...")
    author_names_to_add = set()
    while len(author_names_to_add) < 10:
         author_names_to_add.add(fake.name())

    for name in author_names_to_add:
        existing_author = db.query(Author).filter(Author.author_name == name).first()
        if not existing_author:
            author = Author(
                author_name=name,
                author_bio=fake.text()
            )
            db.add(author)
            db.commit()
            db.refresh(author)
            created_authors.append(author)
        else:
            created_authors.append(existing_author) 
    print(f"Finished seeding authors. Total authors (new + existing): {len(created_authors)}")
    return created_authors


def seed_books(authors, categories):
    books = []
    for _ in range(40):
        book = Book(
            book_title=fake.sentence(nb_words=4),
            book_summary=fake.paragraph(nb_sentences=3),
            book_price=Decimal(random.randint(5, 50)),
            book_cover_photo="cover.jpg",
            author_id=random.choice(authors).id,
            category_id=random.choice(categories).id,
        )
        books.append(book)
    db.add_all(books)
    db.commit()
    return books


def seed_reviews(books):
    reviews = []
    for _ in range(200):
        review = Review(
            book_id=random.choice(books).id,
            review_title=fake.sentence(),
            review_details=fake.text(),
            review_date=fake.date_time_this_year(),
            rating_start = str(random.randint(1, 5))
        )
        reviews.append(review)
    db.add_all(reviews)
    db.commit()


def seed_discounts(books):
    discounts = []
    books_on_sale = random.sample(books, 10)
    for book in books_on_sale:
        price = book.book_price
        discount_price = Decimal(float(price) * random.uniform(0.5, 0.8)).quantize(Decimal('0.01'))
        discount = Discount(
            book_id=book.id,
            discount_start_date=datetime.now().date(),
            discount_end_date=(datetime.now() + timedelta(days=15)).date(),
            discount_price=discount_price
        )
        discounts.append(discount)
    db.add_all(discounts)
    db.commit()


def seed_orders(users, books):
    orders = []
    for _ in range(10):
        user = random.choice(users)
        order_items = []
        total_amount = Decimal('0.00')
        for _ in range(random.randint(1, 4)):
            book = random.choice(books)
            quantity = random.randint(1, 3)
            price = book.book_price
            total_amount += price * quantity

            order_item = OrderItem(
                book_id=book.id,
                quantity=quantity,
                price=price
            )
            order_items.append(order_item)

        order = Order(
            user_id=user.id,
            order_amount=total_amount,
            order_date=fake.date_time_this_year(),
            order_items=order_items
        )
        orders.append(order)

    db.add_all(orders)
    db.commit()


def run_seed():
    print("Starting database seeding...")
    users = seed_users()
    categories = seed_categories()
    authors = seed_authors()
    if not users or not categories or not authors:
        print("Base data (users, categories, authors) missing or failed to seed. Aborting further seeding.")
        return

    print("Seeding books...")
    books = seed_books(authors, categories)
    print(f"Finished seeding books. Total books: {len(books)}") 

    if not books:
        print("Books failed to seed. Aborting further seeding.")
        return

    print("Seeding reviews...")
    seed_reviews(books)
    print("Finished seeding reviews.") 

    print("Seeding discounts...")
    seed_discounts(books)
    print("Finished seeding discounts.") 
    print("Seeding orders and order items...")
    seed_orders(users, books)
    print("Finished seeding orders and order items.") 

    print("Database seeding process completed!")


if __name__ == "__main__":
    run_seed()