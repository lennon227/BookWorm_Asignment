import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import BookList from "./BookList";
import SortBar from "./SortBar";

const Shop = () => {
  const [sort, setSort] = useState("onsale");
  const [booksPerPage, setBooksPerPage] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-20 max-w-screen-2xl mx-auto">
      {/* Mobile Filter Toggle Button */}
      <button
        className="md:hidden w-full mb-6 p-3 bg-gray-100 md:shadow-none hover:bg-gray-200 text-black rounded-xl flex items-center justify-center shadow-sm"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Filters
      </button>

      <div className="flex flex-col md:flex-row gap-6 relative">
        {/* Sidebar */}
        <div className={`
          fixed md:relative md:w-52
          inset-y-0 left-0 z-30
          w-72 bg-white shadow-lg md:shadow-none
          transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          md:transform-none transition-transform duration-300 ease-in-out
          ${isFilterOpen ? 'block' : 'hidden'} md:block
          overflow-y-auto h-screen md:h-auto
          pt-16 md:pt-0
        `}>
          <div className="p-6 md:p-0">
            {/* Close button for mobile */}
            <button 
              className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              onClick={() => setIsFilterOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <FilterSidebar />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isFilterOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <SortBar
            sort={sort}
            onSortChange={setSort}
            limit={booksPerPage}
            onLimitChange={setBooksPerPage}
          />

          <BookList
            sort={sort}
            booksPerPage={booksPerPage}
            setBooksPerPage={setBooksPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;