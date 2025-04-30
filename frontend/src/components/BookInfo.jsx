import React from 'react';

const BookInfo = ({
  title,
  author,
  price,
  salePrice,
  originalPrice,
  compact = false,
}) => {
  const formatPrice = (p) => `$${Number(p).toFixed(2)}`;

  const hasSale = salePrice !== undefined && salePrice !== null;

  return (
    <div className={compact ? 'space-y-1' : ''}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
        {title}
      </h3>
      <p className="text-sm text-gray-500 truncate">{author}</p>

      <div className="mt-1 flex items-center flex-wrap gap-2 text-sm">
        {hasSale ? (
          <>
            {originalPrice ? (
              <span className="line-through text-gray-400">
                {formatPrice(originalPrice)}
              </span>
            ) : null}
            <span className="text-red-600 font-bold">
              {formatPrice(salePrice)}
            </span>
          </>
        ) : (
          <span className="text-gray-800 font-medium">
            {formatPrice(price || originalPrice)}
          </span>
        )}
      </div>
    </div>
  );
};

export default BookInfo;
