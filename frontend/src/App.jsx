import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './Pages/AboutUs';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
import Shop from './Pages/Shop/Shop';
import Product from './Pages/Products/Product';
import { CartProvider } from './context/CartContext';
import AuthProvider from './context/AuthContext'; 
import LoginPopup from './components/Login';

function App() {
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);

  const handleOpenLoginPopup = () => {
    setLoginPopupOpen(true);
  };

  const handleCloseLoginPopup = () => {
    setLoginPopupOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    setLoginPopupOpen(false);  // Đóng popup sau khi đăng nhập thành công
  };

  return (
    <AuthProvider> 
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
              </Routes>
            </main>
            <Footer />
          </div>

          {/* Nếu popup đăng nhập đang mở, hiển thị nó */}
          {isLoginPopupOpen && (
            <LoginPopup
              onClose={handleCloseLoginPopup}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
