import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [ratings, setRatings] = useState([]);
  
  // State để quản lý trạng thái mở/đóng của accordion
  const [openAccordion, setOpenAccordion] = useState({
    category: false,
    author: false,
    rating: false
  });
  
  const currentCategory = searchParams.get("category_name") || "all";
  const currentAuthor = searchParams.get("author_name") || "all";
  const currentRating = searchParams.get("rating") || "all";

  // Lấy categories
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

  // Xử lý mở/đóng accordion
  const toggleAccordion = (section) => {
    setOpenAccordion({
      ...openAccordion,
      [section]: !openAccordion[section]
    });
  };

  // Hàm render item cho mỗi accordion
  const renderAccordionItem = (title, section, items, currentValue, valueKey = "name") => {
    return (
      <div className="mb-3 border rounded-lg overflow-hidden">
        {/* Accordion Header */}
        <button 
          onClick={() => toggleAccordion(section)} 
          className="w-full flex items-center justify-between bg-gray-100 p-4 font-semibold text-left"
        >
          <span>{title}</span>
          <span className="transition-transform duration-300">
            {openAccordion[section] ? "−" : "+"}
          </span>
        </button>
        
        {/* Accordion Content */}
        {openAccordion[section] && (
          <div className="bg-white p-3 border-t max-h-60 overflow-y-auto">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item[valueKey]}>
                  <button
                    onClick={() => handleFilterChange(section, item[valueKey])}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition ${
                      currentValue == item[valueKey] ? "bg-gray-200 font-semibold" : ""
                    }`}
                  >
                    {section === "rating" ? item.label : item[valueKey]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="bg-white rounded-lg p-4 shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      {/* Category Accordion */}
      {renderAccordionItem("Category", "category", categories, currentCategory)}
      {/* Author Accordion */}
      {renderAccordionItem("Author", "author", authors, currentAuthor)}
      {/* Rating Accordion */}
      {renderAccordionItem("Rating", "rating", ratings, currentRating, "value")}
    </aside>
  );
};

export default FilterSidebar;