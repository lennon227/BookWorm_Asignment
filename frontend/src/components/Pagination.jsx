const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
          pages.push(i);
        }
      }
      return pages;
    };
  
    const pageNumbers = getPageNumbers();
  
    return (
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
  
        {pageNumbers.map((p, i, arr) => {
          const prev = arr[i - 1];
          return (
            <span key={p}>
              {prev && p - prev > 1 && <span className="px-2">...</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 border rounded ${
                  currentPage === p ? "bg-black text-white" : ""
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;