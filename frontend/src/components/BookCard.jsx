import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookInfo from './BookInfo';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  // Chuyển đến trang chi tiết sản phẩm
  const handleClick = () => {
    navigate(`/product/${book.id}`);
  };

  const defaultImage = '/assets/default-book-cover.jpeg';

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white border rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
    >
      <img
        src={book.image || defaultImage} // Sử dụng ảnh mặc định nếu không có ảnh
        alt={book.title || 'Book cover'}
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = defaultImage;
        }}
        className="w-full h-48 object-cover"
      />

      {/* Hiển thị thông tin sách bên dưới ảnh */}
      <div className="p-4">
        <BookInfo
          title={book.title}
          author={book.author}
          price={book.price}
          salePrice={book.salePrice}
          originalPrice={book.originalPrice}
        />
      </div>
    </div>
  );
};

export default BookCard;
