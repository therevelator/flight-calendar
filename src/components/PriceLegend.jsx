import React from 'react';
import './PriceLegend.css';

const PriceLegend = () => {
  return (
    <div className="price-legend">
      <div className="price-range">
        <div className="price-indicator price-low"></div>
        <span>≤ €50</span>
      </div>
      <div className="price-range">
        <div className="price-indicator price-medium"></div>
        <span>€100</span>
      </div>
      <div className="price-range">
        <div className="price-indicator price-high"></div>
        <span>≥ €150</span>
      </div>
    </div>
  );
};

export default PriceLegend; 