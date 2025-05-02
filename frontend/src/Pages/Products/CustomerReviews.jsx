import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";

const CustomerReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/product/${productId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json();

        setReviews(data.reviews);

        // Tính toán thông kê đánh giá và rating
        const total = data.reviews.length;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const sum = data.reviews.reduce((acc, review) => {
          distribution[review.rating_start]++;
          return acc + review.rating_start;
        }, 0);

        setStats({
          average: total > 0 ? (sum / total).toFixed(1) : 0,
          total,
          distribution
        });
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [productId]);

  // Lọc và sort reviews
  const filteredAndSortedReviews = (() => {
    let result = [...reviews];
    
    // Lọc
    if (filter) result = result.filter(review => review.rating_start === filter);
    
    // Sort
    return result.sort((a, b) => {
      const dateA = new Date(a.review_date).getTime();
      const dateB = new Date(b.review_date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  })();

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredAndSortedReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);

  // Event handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ 
      top: document.getElementById('customer-reviews').offsetTop - 100, 
      behavior: 'smooth' 
    });
  };

  const handleFilterClick = (rating) => {
    setFilter(rating === filter ? null : rating);
    setCurrentPage(1);
  };

  // UI Components
  const SortDropdown = () => (
    <div className="relative">
      <button
        className="pl-4 pr-10 py-2 bg-gray-500 text-white rounded flex items-center relative focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        style={{ paddingRight: '2.5rem' }}
      >
        {sortBy === "newest" ? "Sort By Newest" : "Sort By Oldest"}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </button>

      {showSortDropdown && (
        <div className="absolute right-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-10">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setSortBy("newest"); setShowSortDropdown(false); }}
          >
            Sort by date: newest to oldest
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => { setSortBy("oldest"); setShowSortDropdown(false); }}
          >
            Sort by date: oldest to newest
          </button>
        </div>
      )}
    </div>
  );

  const ItemsPerPageSelector = () => (
    <div className="relative">
      <label htmlFor="itemsPerPage" className="sr-only">Show reviews per page</label>
      <select
        id="itemsPerPage"
        value={itemsPerPage}
        onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
        className="px-4 py-2 border border-gray-500 rounded bg-gray-500 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
        style={{ paddingRight: '2.5rem' }}
      >
        {[5, 10, 15, 20, 25].map(value => (
          <option key={value} value={value} style={{ backgroundColor: 'white', color: 'black' }}>
            Show {value}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );

  if (loading) return <div className="p-6 text-center">Loading reviews...</div>;

  return (
    <div id="customer-reviews" className="border rounded-lg p-6 bg-white">
      <h2 className="text-2xl font-bold mb-2">
        Customer Reviews
        {filter && <span className="text-lg font-normal text-gray-500 ml-2">(Filtered by {filter} star)</span>}
      </h2>
      
      {/* Average Rating and Distribution */}
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold mr-2">{stats.average}</span>
          <span className="text-2xl">Star</span>
        </div>
        <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
          <button
            onClick={() => handleFilterClick(null)}
            className={`mr-4 hover:underline ${!filter ? 'font-bold' : ''}`}
          >
            ({stats.total})
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => handleFilterClick(rating)}
              className={`mr-4 hover:underline ${filter === rating ? 'font-bold' : ''}`}
            >
              {rating} star ({stats.distribution[rating]})
            </button>
          ))}
        </div>
      </div>
      
      {/* Reviews Count & Sorting */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {filteredAndSortedReviews.length > 0 
            ? `Showing ${indexOfFirstItem + 1}–${Math.min(indexOfLastItem, filteredAndSortedReviews.length)} of ${filteredAndSortedReviews.length} reviews`
            : "No reviews found"
          }
        </div>
        
        <div className="flex space-x-2">
          <SortDropdown />
          <ItemsPerPageSelector />
        </div>
      </div>
      
      {/* Reviews List */}
      <div>
        {currentReviews.length > 0 ? (
          currentReviews.map(review => (
            <div key={review.id} className="py-4 border-t first:border-t-0">
              <h3 className="text-xl font-bold">
                {review.review_title} 
                <span className="text-sm font-normal ml-2">
                  | {review.rating_start} {review.rating_start === 1 ? 'star' : 'stars'}
                </span>
              </h3>
              <p className="my-2">{review.review_details}</p>
              <p className="text-sm text-gray-600">{review.review_date}</p>
            </div>
          ))
        ) : (
          <p className="py-4 text-center">No reviews match your filter criteria.</p>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};
export default CustomerReviews;