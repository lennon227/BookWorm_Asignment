from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import home, shop, auth, product, user, order

app = FastAPI(
    title="TEST_BOOKSTORE API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(home.router)
app.include_router(shop.router)
app.include_router(product.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(order.router, tags=["Order"])
