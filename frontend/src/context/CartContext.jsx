import React, { createContext, useState, useEffect } from 'react';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo state giỏ hàng, lấy từ localStorage nếu có
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Mỗi khi giỏ hàng thay đổi, lưu lại vào localStorage để giữ dữ liệu khi reload trang
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Lấy số lượng hiện tại của một sản phẩm trong giỏ hàng
  const getCartItemQuantity = (productId) => {
    const existingItem = cart.find((item) => (item.id || item.book_id) === productId);
    return existingItem ? existingItem.quantity : 0;
  };

  // Thêm sản phẩm vào giỏ với giới hạn tối đa 8 sản phẩm
  const addToCart = (item) => {
    const itemId = item.id || item.book_id;
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => (cartItem.id || cartItem.book_id) === itemId);
      
      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ, tính tổng số lượng mới
        const newQuantity = existingItem.quantity + item.quantity;
        
        // Kiểm tra giới hạn số lượng
        if (newQuantity > 8) {
          // Hiển thị thông báo
          alert(`Số lượng tối đa cho một sản phẩm là 8. Chỉ có thể thêm ${8 - existingItem.quantity} sản phẩm nữa.`);
          
          // Cập nhật với số lượng tối đa là 8
          return prevCart.map((cartItem) =>
            (cartItem.id || cartItem.book_id) === itemId
              ? { ...cartItem, quantity: 8 }
              : cartItem
          );
        } else {
          // Cập nhật số lượng bình thường
          return prevCart.map((cartItem) =>
            (cartItem.id || cartItem.book_id) === itemId
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          );
        }
      } else {
        // Nếu chưa có, thêm sản phẩm mới với số lượng đã được giới hạn (tối đa là 8)
        const limitedQuantity = Math.min(item.quantity, 8);
        
        if (limitedQuantity < item.quantity) {
          alert(`Số lượng tối đa cho một sản phẩm là 8. Đã thêm 8 sản phẩm vào giỏ hàng.`);
        }
        
        return [...prevCart, { ...item, quantity: limitedQuantity }];
      }
    });
  };

  // Cập nhật số lượng sản phẩm trong giỏ với giới hạn tối đa 8
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) => {
      // Nếu số lượng <= 0 thì xoá sản phẩm khỏi giỏ
      if (quantity <= 0) {
        return prevCart.filter((item) => (item.id || item.book_id) !== id);
      }
      
      // Giới hạn số lượng tối đa là 8
      const limitedQuantity = Math.min(quantity, 8);
      
      if (limitedQuantity < quantity) {
        alert(`Số lượng tối đa cho một sản phẩm là 8.`);
      }
      
      return prevCart.map((item) =>
        (item.id || item.book_id) === id ? { ...item, quantity: limitedQuantity } : item
      );
    });
  };

  // Xoá một sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.id || item.book_id) !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        totalAmount,
        getCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};