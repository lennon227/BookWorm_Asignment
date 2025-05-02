import React, { useState } from "react";

const SubmitReviewForm = ({productId, onReviewAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("1 Star");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!title.trim() || !rating) {
      alert("Vui lòng điền tiêu đề và chọn rating cho sản phẩm");
      return;
    }

    // covert rating sang dạng số
    const ratingValue = parseInt(rating.split(" ")[0]);

    try {
      setIsSubmitting(true);

      const reviewData = {
        book_id: productId,
        review_title: title,
        review_details: content, // Content is optional
        rating_start: ratingValue,
      };

      // Gửi yêu cầu POST đến API
      const response = await fetch(`http://127.0.0.1:8000/product/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setShowSuccess(true);

      // reset sau khi submit
      setTitle("");
      setContent("");
      setRating("1 Star");

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      alert("Error submitting review: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Write a Review</h2>
      
      {/* Success message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Review của bạn đã được gửi thành công!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm mb-1">
            Add a title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm mb-1">
            Details please! Your review helps other shoppers.
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-md p-2 h-24"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm mb-1">
            Select a rating star <span className="text-red-500">*</span>
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="1 Star">1 Star</option>
            <option value="2 Star">2 Star</option>
            <option value="3 Star">3 Star</option>
            <option value="4 Star">4 Star</option>
            <option value="5 Star">5 Star</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gray-200 py-3 rounded-md font-medium hover:bg-gray-300 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default SubmitReviewForm;