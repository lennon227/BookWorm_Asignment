import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const {
    book_title,
    book_summary,
    author_name,
    image,
    reviews,
  } = book || {};

  const defaultImage = '/assets/default-book-cover.jpeg';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Book Image */}
        <div className="flex-shrink-0 w-full md:w-1/3">
          <img
            src={image || defaultImage}
            alt={book_title || "Book cover"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
            className="w-full h-64 object-cover border rounded-md"
          />
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{book_title}</h1>
          <p className="text-gray-600 mb-2">
            By <span className="font-semibold">{author_name}</span>
          </p>
          <p className="text-gray-800 mb-4 whitespace-pre-line">{book_summary}</p>

          {reviews?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">Reviews:</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {reviews.slice(0, 3).map((r) => (
                  <li key={r.id}>
                    <strong>{r.review_title}</strong>: {r.review_details}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;