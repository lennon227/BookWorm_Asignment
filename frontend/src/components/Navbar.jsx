import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import LoginPopup from "../components/Login"; 
import axios from "axios";

const Navbar = () => {
  const { cartItemCount } = useContext(CartContext);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, login, logout} = useContext(AuthContext); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://127.0.0.1:8000/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        login(token, res.data);
      }).catch(() => {
        localStorage.removeItem("token");
      });
    }
  }, []);

  const handleLoginClick = () => {
    setShowLoginPopup(true);
    setMenuOpen(false);
  };

  const handleClosePopup = () => setShowLoginPopup(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowDropdown(false);
    }, 200); 
    setDropdownTimeout(timeout);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-md py-4 px-6 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/assets/logo.jpeg" alt="Logo" className="h-8 w-8" />
          <Link to="/" className="text-2xl font-bold text-gray-800">
            BookWorm
          </Link>
        </div>

        {/* Hamburger icon (mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/shop" className="text-gray-600 hover:text-blue-600">Shop</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-gray-600 hover:text-blue-600">
                {user.first_name} {user.last_name}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleLoginClick} className="text-gray-600 hover:text-blue-600">
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-4 space-y-4 flex flex-col bg-gray-50 py-4 rounded shadow-md">
          <Link to="/" className="text-gray-700" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="text-gray-700" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/about" className="text-gray-700" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/cart" className="text-gray-700" onClick={() => setMenuOpen(false)}>
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </Link>
          {user ? (
            <div className="text-gray-700">
              {user.first_name} {user.last_name}
              <button onClick={handleLogout} className="block mt-2 text-blue-600">Logout</button>
            </div>
          ) : (
            <button onClick={handleLoginClick} className="text-left text-gray-700 hover:text-blue-600">
              Login
            </button>
          )}
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && <LoginPopup onClose={handleClosePopup} onLoginSuccess={login} />}
    </nav>
  );
};

export default Navbar;