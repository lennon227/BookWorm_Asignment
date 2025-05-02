import React, { useContext, useState } from 'react';
import CartItem from './CartItem';
import CartTotal from './CartTotal';
import LoginPopup from '../../components/Login';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

const Cart = ({ setUser }) => {
  const { cart, cartItemCount } = useContext(CartContext);
  const { isAuthenticated, login } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleLoginSuccess = () => {
    // Đăng nhập xong thì gọi lại handlePlaceOrder trong CartTotal
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-medium mb-4">Your cart: {cartItemCount} items</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3 border rounded">
          <div className="hidden sm:grid sm:grid-cols-[3fr_1fr_1fr] p-4 bg-gray-50 border-b text-xl">
            <div className="text-center sm:text-left font-medium">Product</div>
            <div className="text-center font-medium">Quantity</div>
            <div className="text-center font-medium">Total</div>
          </div>
          <div>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <CartTotal
            total={total}
            cartItems={cart}
            onRequireLogin={() => setShowLogin(true)} // truyền hàm mở popup
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
      {/* Hiển thị login popup nếu cần */}
      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(userData) => {
            login(localStorage.getItem('token'), userData); // gọi login trong AuthContext
            if (setUser) { // Kiểm tra xem setUser có tồn tại không
              setUser(userData); // Nếu có thì gọi setUser
            }
            setShowLogin(false);
            handleLoginSuccess();
          }}
        />
      )}
    </div>
  );
};

export default Cart;