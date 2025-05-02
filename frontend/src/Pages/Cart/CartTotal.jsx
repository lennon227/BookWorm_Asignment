import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartTotal = ({ total, cartItems = [], onRequireLogin, onLoginSuccess }) => {
  const { isAuthenticated, token, user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderDataAfterLogin, setOrderDataAfterLogin] = useState(null);
  const navigate = useNavigate(); 
  
  const generateOrderData = () => ({
    user_id: user?.id,
    order_amount: total,
    order_items: cartItems.map((item) => ({
      book_id: item.id || item.book_id,
      quantity: item.quantity,
      price: item.price,
    })),
  });
  
  const handlePlaceOrder = async () => {
    // Nếu chưa đăng nhập
    if (!isAuthenticated) {
      const orderData = generateOrderData();
      setOrderDataAfterLogin(orderData);
      onRequireLogin(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      });
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/orders`,
        orderDataAfterLogin || generateOrderData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert('Đặt hàng thành công!');
      clearCart();
      navigate('/'); // Chuyển hướng về trang chủ sau khi đặt hàng thành công
      
    } catch (error) {
      console.error('Order error:', error);
      if (error.response?.data?.detail) {
        alert(`Đặt hàng thất bại: ${error.response.data.detail}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setIsPlacingOrder(false);
      setOrderDataAfterLogin(null);
    }
  };
  
  // Gọi lại handlePlaceOrder sau khi đăng nhập xong
  useEffect(() => {
    if (isAuthenticated && orderDataAfterLogin) {
      handlePlaceOrder();
    }
  }, [isAuthenticated]);
  
  return (
    <div className="border rounded p-4 shadow-md text-center">
      <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
      <div className="mb-4">
        <span className="font-bold text-lg">${total.toFixed(2)}</span>
      </div>
      {!isAuthenticated && cartItems.length > 0 && (
        <p className="text-red-600 mb-2 flex items-center justify-center gap-1">
          <span role="img" aria-label="lock">🔒</span> You must log in to place an order.
        </p>
      )}
      <button
        onClick={handlePlaceOrder}
        className={`w-full py-2 rounded ${
          cartItems.length === 0
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : isAuthenticated
              ? 'bg-blue-600 text-white'
              : 'bg-gray-500 text-white'
        }`}
        disabled={cartItems.length === 0 || isPlacingOrder}
      >
        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default CartTotal;