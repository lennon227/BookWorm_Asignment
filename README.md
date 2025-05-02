# Bookstore – Fullstack Web Application

## Project Overview

**Bookstore** is a comprehensive online book-selling platform offering features such as browsing, filtering, sorting, adding to cart, reviewing books, placing orders, and user authentication using JWT. The application includes the following main pages: `Home`, `Shop`, `Product`, `Cart`, and `Login`.

---

## Technology Stack

### Backend
- **FastAPI**: Python web framework
- **SQLAlchemy**: ORM for database interaction
- **Alembic**: Database migrations
- **PostgreSQL**: Relational database
- **OAuth2 with JWT**: Authentication

### Frontend
- **React.js**: Frontend library
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool for modern web projects
- **Context API**: State management

---

## Project Structure

```
├── backend/                # Backend FastAPI application
│   ├── app/
│   │   ├── core/          # Core configurations
│   │   ├── db/            # Database configurations
│   │   ├── dependencies/  # Dependencies and middleware
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API routes
│   │   └── schemas/       # Pydantic schemas
│   └── alembic/           # Database migrations
└── frontend/              # Frontend React application
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── context/       # React Context providers
    │   ├── pages/         # Application pages
    └── public/            # Static assets
```

---

## Getting Started

### Prerequisites
- **Python**: Version 3.10+
- **Node.js**: Version 16+
- **PostgreSQL**: Installed and running

### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  
   ```

2. Install dependencies:
   ```bash
   cd app
   pip install -r requirements.txt
   ```

3. Configure environment variables by creating a `.env` file.

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

---

## API Documentation

Once the backend server is running, access the following:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Pages & Features

### 🏠 Home
- **On Sale Books**: Displays the top 10 books with the highest discounts.
- **Featured Books**:
  - **Recommended**: Top 8 books with the highest ratings, prioritized by lower prices.
  - **Popular**: Top 8 books with the most reviews, prioritized by lower prices.

### 🛍️ Shop
- **Book Listing**: Displays books with sorting and filtering options.
- **Sorting Options**:
  - **On Sale (default)**: `sub_price DESC → final_price ASC`
  - **Popularity**: `reviews DESC → final_price ASC`
  - **Price**: `final_price ASC/DESC`
- **Filtering Options**:
  - **Category**: Alphabetical (A–Z)
  - **Author**: Alphabetical (A–Z)
  - **Rating**: Books with ratings ≥ x (1–5)

### 📖 Product
- **Book Details**: Displays complete book information.
- **Add to Cart**:
  - Shows original and discounted prices.
  - Allows selecting quantity (1–8).
  - Updates the cart and navbar.
- **Customer Reviews**:
  - Displays total reviews, average rating, and allows filtering by star rating or sorting by date.
  - **Submit Review**: Users can submit a review with a title and rating.

### 🛒 Cart
- **Item List**: Displays book image, title, author, price, quantity, and total price.
- **Cart Total & Order**:
  - Calculates the total price.
  - **Place Order**:
    - If not logged in: Prompts a login popup.
    - If logged in: Sends API request, checks stock availability, saves to the database, or displays an error.

### 🔐 Login
- **Login**: Allows users to log in using email and password.
- After login:
  - Displays the user's name.
  - Provides a logout option.

---