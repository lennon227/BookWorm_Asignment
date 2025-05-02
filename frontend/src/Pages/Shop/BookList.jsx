import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../../components/BookCard";
import Pagination from "../../components/Pagination";

const BookList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sort = searchParams.get("sort") || "on_sale";
  const category = searchParams.get("category_name");
  const author = searchParams.get("author_name");
  const rating = searchParams.get("rating");

  const skip = (currentPage - 1) * limit;
  const indexOfFirstBook = skip + 1;
  const indexOfLastBook = Math.min(skip + limit, totalBooks);

  useEffect(() => {
    setLoading(true);

    let url = `http://127.0.0.1:8000/shop/books?skip=${skip}&limit=${limit}`;
    if (sort) url += `&sort=${sort}`;
    if (category && category !== "all") url += `&category_name=${category}`;
    if (author && author !== "all") url += `&author_name=${author}`;
    if (rating && rating !== "all") url += `&rating=${rating}`;

    console.log("Fetching books with URL:", url);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setBooks(data.books || []);
        setTotalBooks(data.total || 0);
        setLoading(false);
        console.log("Received books:", data.books?.length, "Total:", data.total);
      })
      .catch(error => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, [skip, limit, sort, category, author, rating]);

  const handleChangePage = (page) => {
    console.log("Changing to page:", page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalBooks / limit);

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-600">
        {loading ? (
          "Loading..."
        ) : totalBooks > 0 ? (
          `Showing ${indexOfFirstBook}–${indexOfLastBook} of ${totalBooks} books`
        ) : (
          "No books found"
        )}
      </p>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {books.map((book) => (
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

          {books.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">No books found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookList;