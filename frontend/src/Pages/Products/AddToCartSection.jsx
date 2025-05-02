import React, { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";

const AddToCartSection = ({ book }) => {
  const { price, discount_price, id } = book || {};
  const [quantity, setQuantity] = useState(1);
  const { addToCart, getCartItemQuantity } = useContext(CartContext);
  
  const isDiscountValid = discount_price && parseFloat(discount_price) < parseFloat(price);
  const finalPrice = isDiscountValid ? parseFloat(discount_price) : parseFloat(price);
  const totalPrice = finalPrice * quantity;
  
  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + amount, 8)));
  };
  
  const handleAddToCart = () => {
    const bookId = id || book._id || book.book_id;
    if (!bookId) {
      alert("Không thể thêm vào giỏ hàng: Thiếu ID sách");
      return;
    }
    
    const currentQuantity = getCartItemQuantity(bookId);
    const availableToAdd = 8 - currentQuantity;
    
    if (availableToAdd <= 0) {
      alert(`Đã có đủ 8 sản phẩm "${book.book_title}" trong giỏ hàng. Không thể thêm nữa.`);
      return;
    }
    
    if (quantity > availableToAdd) {
      alert(`Chỉ có thể thêm ${availableToAdd} sản phẩm "${book.book_title}" nữa để đạt giới hạn tối đa (8).`);
      addToCart({
        id: bookId,
        title: book.book_title,
        price: finalPrice,
        quantity: availableToAdd,
        image: book.image || book.cover_image
      });
    } else {
      addToCart({
        id: bookId,
        title: book.book_title,
        price: finalPrice,
        quantity,
        image: book.image || book.cover_image
      });
      alert(`Đã thêm ${quantity} sản phẩm "${book.book_title}" vào giỏ hàng!`);
    }
  };
  
  return (
    <div className="border rounded-md p-4 w-full max-w-sm">
      <div className="text-xl font-bold mb-2">
        {isDiscountValid && (
          <span className="line-through text-gray-400 mr-2">${price}</span>
        )}
        <span>${finalPrice.toFixed(2)}</span>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-1">Quantity</p>
        <div className="flex items-center bg-gray-100 rounded-md max-w-[300px]">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-16 h-10 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <span className="text-xl">−</span>
          </button>
          <div className="flex-1 h-10 flex items-center justify-center text-center">
            <span>{quantity}</span>
          </div>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-16 h-10 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium">
          Total: <span className="font-bold">${totalPrice.toFixed(2)}</span>
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 font-semibold rounded-md text-lg"
      >
        Add to cart
      </button>
    </div>
  );
};

export default AddToCartSection;