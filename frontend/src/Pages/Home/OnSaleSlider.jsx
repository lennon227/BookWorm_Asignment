import React, { useState, useEffect } from 'react';
import BookCard from '../../components/BookCard';
import { useNavigate } from 'react-router-dom';

const OnSaleSlider = () => {
  const [booksOnSale, setBooksOnSale] = useState([]); // State để lưu trữ dữ liệu từ API
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1; // Mobile
    if (windowWidth < 768) return 2; // Small tablets
    if (windowWidth < 1024) return 3; // Tablets/small laptops
    return 4; // Desktop
  };

  const ITEMS_PER_PAGE = getItemsPerPage();

  useEffect(() => {
    // Lấy dữ liệu từ API
    const fetchBooksOnSale = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/books/top-sales');
        const data = await response.json();
        setBooksOnSale(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Failed to fetch books on sale', error);
      }
    };
    fetchBooksOnSale();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();
  
  const totalSlides = Math.ceil(booksOnSale.length / ITEMS_PER_PAGE);
  
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const visibleBooks = booksOnSale.slice(
    currentSlide * ITEMS_PER_PAGE,
    currentSlide * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <div className="mb-12 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">On Sale</h2>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          onClick={() => {navigate('/shop?skip=0&limit=20&sort=on_sale');}}
        >
          View All
        </button>
      </div>
      
      <div className="relative border rounded p-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border shadow p-2 rounded-full z-10"
        >
          ◀
        </button>
        
        {/* Slider Content */}
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out">
            {visibleBooks.map((book) => (
              <div 
                key={book.book_id} 
                className={`${
                  windowWidth < 640 ? 'w-full' : 
                  windowWidth < 768 ? 'w-1/2' : 
                  windowWidth < 1024 ? 'w-1/3' : 
                  'w-1/4'
                } p-2 flex-shrink-0`}
              >
                <BookCard
                  book={{
                    id: book.book_id,
                    title: book.book_title,
                    author: book.author_name,
                    image: book.image || "https://via.placeholder.com/200x300?text=No+Image",
                    originalPrice: book.price,
                    salePrice: book.discount_price || book.price,
                    finalPrice: book.discount_price || book.price
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border shadow p-2 rounded-full z-10"
        >
          ▶
        </button>

        {windowWidth < 640 && totalSlides > 1 && (
          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnSaleSlider;