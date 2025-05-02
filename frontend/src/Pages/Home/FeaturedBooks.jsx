import React, { useState, useEffect } from 'react';
import BookCard from '../../components/BookCard';

const FeaturedBooks = () => {
  const [tab, setTab] = useState('recommended');
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [recommendedRes, popularRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/books/recommended'),
          fetch('http://127.0.0.1:8000/books/popular')
        ]);
        const [recommendedData, popularData] = await Promise.all([
          recommendedRes.json(),
          popularRes.json()
        ]);

        setRecommendedBooks(recommendedData);
        setPopularBooks(popularData);
      } catch (error) {
        console.error('Failed to fetch featured books:', error);
      }
    };

    fetchBooks();
  }, []);

  const activeBooks = tab === 'recommended' ? recommendedBooks : popularBooks;

  return (
    <section className="mb-12 px-4">
      <div className="border rounded p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Featured Books</h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab('recommended')}
            className={`px-4 py-1 rounded-full text-sm font-medium shadow ${
              tab === 'recommended' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Recommended
          </button>
          <button
            onClick={() => setTab('popular')}
            className={`px-4 py-1 rounded-full text-sm font-medium shadow ${
              tab === 'popular' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Popular
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {activeBooks.map((book) => (
            <BookCard
              key={book.book_id}
              book={{
                id: book.book_id,
                title: book.book_title,
                author: book.author_name,
                image: book.image || "https://via.placeholder.com/200x300?text=No+Image",
                originalPrice: book.discount_price ? book.price : null, // Chỉ hiển thị giá gạch ngang nếu có giá sale
                salePrice: book.discount_price || null, // Hiển thị giá sale nếu có
                price: !book.discount_price ? book.price : null // Hiển thị giá thường nếu không có giá sale
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;