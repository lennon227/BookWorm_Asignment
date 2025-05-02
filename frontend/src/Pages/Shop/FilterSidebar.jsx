import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [ratings, setRatings] = useState([]);
  
  const currentCategory = searchParams.get("category_name") || "all";
  const currentAuthor = searchParams.get("author_name") || "all";
  const currentRating = searchParams.get("rating") || "all";

  // Lấy catgories
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/categories")
      .then(response => response.json())
      .then(data => {
        // Thêm tùy chọn "all" vào danh sách categories
        setCategories([{name: "all"}, ...data]);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Lấy authors
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/authors")
      .then(response => response.json())
      .then(data => {
        // Thêm tùy chọn "all" vào danh sách authors
        setAuthors([{name: "all"}, ...data]);
      })
      .catch(error => console.error("Error fetching authors:", error));
  }, []);

  // Lấy ratings
  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/ratings")
      .then(response => response.json())
      .then(data => {
        setRatings(data);
      })
      .catch(error => console.error("Error fetching ratings:", error));
  }, []);

  const handleFilterChange = (filterType, value) => {
    const paramName = filterType === "category" ? "category_name" :
                      filterType === "author" ? "author_name" : filterType;
    
    searchParams.set(paramName, value);
    searchParams.set("page", 1); // Reset trang khi thay đổi bộ lọc
    setSearchParams(searchParams);
  };

  return (
    <aside className="bg-white rounded-lg p-4 shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Filter by Category */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-lg">Category</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <button
                  onClick={() => handleFilterChange("category", category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition ${
                    currentCategory === category.name ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Filter by Author */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-lg">Author</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ul className="space-y-2">
            {authors.map((author) => (
              <li key={author.name}>
                <button
                  onClick={() => handleFilterChange("author", author.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition ${
                    currentAuthor === author.name ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {author.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Filter by Rating */}
      <div>
        <h3 className="font-semibold mb-2 text-lg">Rating</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ul className="space-y-2">
            {ratings.map((rating) => (
              <li key={rating.value}>
                <button
                  onClick={() => handleFilterChange("rating", rating.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition ${
                    currentRating == rating.value ? "bg-gray-200 font-semibold" : ""
                  }`}
                >
                  {rating.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;