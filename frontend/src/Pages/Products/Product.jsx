import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetails from "./BookDetails";
import AddToCartSection from "./AddToCartSection";
import CustomerReviews from "./CustomerReviews";
import SubmitReviewForm from "./SubmitReviewForm";

const Product = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin sách từ API
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/product/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToCart = ({ bookId, quantity }) => {
    console.log("Added to cart:", { bookId, quantity });
    alert("Book added to cart!");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left section: Book info */}
        <div className="md:col-span-2">
          <BookDetails book={book} />
        </div>

        {/* Right section: Add to cart */}
        <div>
          <AddToCartSection book={book} onAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {/* Customer Reviews List */}
        <div className="md:col-span-2">
          <CustomerReviews productId={id} />
        </div>

        {/* Submit Review Form */}
        <div>
          <SubmitReviewForm productId={id} />
        </div>
      </div>
    </div>
  );
};

export default Product;
