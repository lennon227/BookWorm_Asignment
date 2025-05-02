import React from 'react';
import OnSaleSlider from './OnSaleSlider';
import FeaturedBooks from './FeaturedBooks';

const Home = () => {
  return (
    <div className="pt-24 px-4 md:px-10">
      <OnSaleSlider />
      <FeaturedBooks />
    </div>
  );
};

export default Home;
