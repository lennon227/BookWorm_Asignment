import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import BookList from "./BookList";
import SortBar from "./SortBar";

const Shop = () => {
  const [sort, setSort] = useState("onsale");
  const [booksPerPage, setBooksPerPage] = useState(20);

  return (
    <div className="px-4 md:px-8 lg:px-12 xl:px-20 max-w-screen-2xl mx-auto">
      <div className="flex gap-6">
        {/* Sidebar thu nhỏ */}
        <div className="w-52">
          <FilterSidebar />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {/* Thanh sắp xếp & chọn số sách/trang */}
          <SortBar
            sort={sort}
            onSortChange={setSort}
            limit={booksPerPage}
            onLimitChange={setBooksPerPage}
          />

          {/* Danh sách sách hiển thị */}
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