import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SortBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [limitOptions, setLimitOptions] = useState([]);
  
  const sort = searchParams.get("sort") || "on_sale";
  const limit = searchParams.get("limit") || "20";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/shop/limits")
      .then(response => response.json())
      .then(data => {
        setLimitOptions(data);
      })
      .catch(error => console.error("Error fetching limits:", error));
  }, []);

  const handleSortChange = (e) => {
    searchParams.set("sort", e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const handleLimitChange = (e) => {
    searchParams.set("limit", e.target.value);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  return (
    <div className="flex justify-end items-center gap-4 mb-4 flex-wrap">
      {/* Sort by */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSortChange}
          className="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="on_sale">On Sale</option>
          <option value="popularity">Popularity</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Show limit */}
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg shadow-sm">
        <label htmlFor="limit" className="text-sm font-medium text-gray-700">
          Show
        </label>
        <select
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
        >
          {limitOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortBar;