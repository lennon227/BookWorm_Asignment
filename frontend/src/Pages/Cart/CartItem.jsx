import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  
  const itemId = item.id || item._id || item.book_id || item.product_id;
  const { title, price, quantity, image } = item || {};
  
  const handleImageError = (e) => {
    e.target.src = '/assets/default-book-cover.jpeg';
  };
  
  // Hàm điều hướng đến trang chi tiết sản phẩm
  const handleNavigate = () => {
    if (itemId) {
      navigate(`/product/${itemId}`);
    } else if (title) {
      navigate(`/search?query=${encodeURIComponent(title)}`);
      console.warn("Using title to search because ID is missing:", title);
    } else {
      console.error("Cannot navigate: Missing both ID and title");
      alert("Cannot view product details: Missing product information");
    }
  };
  
  const displayPrice = price ? price.toFixed(2) : "0.00";
  const totalPrice = price && quantity ? (price * quantity).toFixed(2) : "0.00";
  
  // Hàm xử lý tăng số lượng với giới hạn tối đa là 8
  const handleIncreaseQuantity = () => {
    if (!itemId) return;
    
    if (quantity >= 8) {
      alert("Số lượng tối đa cho một sản phẩm là 8.");
      return;
    }
    
    updateQuantity(itemId, quantity + 1);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] items-center gap-4 p-4 border-b">
      {/* Product Info (clickable) */}
      <div
        onClick={handleNavigate}
        className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition rounded p-2"
      >
        <img
          src={image || '/asset/logo.jpeg'}
          onError={handleImageError}
          alt={title || "Product"}
          className="w-20 h-20 object-cover rounded flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-medium truncate" title={title}>
            {title || "Unknown Product"}
          </h3>
          <p className="text-sm text-gray-500">${displayPrice}</p>
        </div>
      </div>
      
      {/* Quantity */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => itemId && updateQuantity(itemId, quantity - 1)}
          className="px-2 py-1 border rounded"
          disabled={!itemId}
        >
          -
        </button>
        <span className="mx-2">{quantity || 0}</span>
        <button
          onClick={handleIncreaseQuantity}
          className="px-2 py-1 border rounded"
          disabled={!itemId || quantity >= 8}
        >
          +
        </button>
      </div>
      
      {/* Total and Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <p className="text-lg font-medium">${totalPrice}</p>
        <button
          onClick={() => itemId && updateQuantity(itemId, 0)}
          className="text-gray-500 hover:text-gray-700"
          disabled={!itemId}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default CartItem;