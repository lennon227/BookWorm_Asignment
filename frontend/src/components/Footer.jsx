import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 px-6 md:px-10 mt-auto">
      <div className="container mx-auto flex items-center space-x-4">
        {/* Logo */}
        <img src="/assets/logo.jpeg" alt="BookWorm Logo" className="h-16 w-16 object-cover" />

        {/* Brand Info */}
        <div className="text-left">
          <h2 className="text-lg font-semibold text-gray-800">BOOKWORM</h2>
          <p className="text-sm">123 Book St, Reading City, BK 10001</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
