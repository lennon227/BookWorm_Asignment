import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-6 md:px-10 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to Bookworm</h1>
      <p className="text-center text-gray-700 mb-10">
        "Bookworm is an independent New York bookstore and language school with locations in Manhattan and Brooklyn. 
        We specialize in travel books and language classes."
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Our Story */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600">
            The name Bookworm was taken from the original name for New York International Airport, 
            which was renamed JFK in December 1963.
          </p>
          <p className="text-gray-600 mt-4">
            Our Manhattan store has just moved to the West Village. Our new location is 170 7th Avenue South, 
            at the corner of Perry Street.
          </p>
          <p className="text-gray-600 mt-4">
            From March 2008 through May 2016, the store was located in the Flatiron District.
          </p>
        </div>
        {/* Our Vision */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-600">
            One of the last travel bookstores in the country, our Manhattan store carries a range of guidebooks 
            (all 10% off) to suit the needs and tastes of every traveler and budget.
          </p>
          <p className="text-gray-600 mt-4">
            We believe that a novel or travelogue can be just as valuable a key to a place as any guidebook, 
            and our well-read, well-traveled staff is happy to make reading recommendations for any traveler, 
            book lover, or gift giver.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;