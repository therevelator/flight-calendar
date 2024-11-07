import React, { useState } from 'react';

const BaggageCalculator = () => {
  const [baggage, setBaggage] = useState({
    cabin: 'small',
    checked: 'none'
  });

  const prices = {
    cabin: {
      small: { price: 0, weight: '5kg', label: 'Small Bag (Free)' },
      medium: { price: 20, weight: '10kg', label: '10kg Bag' }
    },
    checked: {
      none: { price: 0, weight: '0kg', label: 'No Bag' },
      small: { price: 25, weight: '20kg', label: '20kg Bag' },
      large: { price: 35, weight: '25kg', label: '25kg Bag' }
    }
  };

  const totalPrice = prices.cabin[baggage.cabin].price + prices.checked[baggage.checked].price;

  return (
    <div className="baggage-calculator">
      <h3>✈️ Baggage Calculator</h3>
      <div className="baggage-options">
        <div className="baggage-type">
          <label>Cabin Bag</label>
          <select 
            value={baggage.cabin}
            onChange={(e) => setBaggage(prev => ({ ...prev, cabin: e.target.value }))}
          >
            <option value="small">{prices.cabin.small.label}</option>
            <option value="medium">{prices.cabin.medium.label} (+€{prices.cabin.medium.price})</option>
          </select>
        </div>
        <div className="baggage-type">
          <label>Checked Bag</label>
          <select
            value={baggage.checked}
            onChange={(e) => setBaggage(prev => ({ ...prev, checked: e.target.value }))}
          >
            <option value="none">{prices.checked.none.label}</option>
            <option value="small">{prices.checked.small.label} (+€{prices.checked.small.price})</option>
            <option value="large">{prices.checked.large.label} (+€{prices.checked.large.price})</option>
          </select>
        </div>
      </div>
      <div className="baggage-summary">
        <div className="weight-summary">
          Total Weight: {parseInt(prices.cabin[baggage.cabin].weight) + parseInt(prices.checked[baggage.checked].weight)}kg
        </div>
        <div className="price-summary">
          Total Extra Cost: €{totalPrice}
        </div>
      </div>
    </div>
  );
};

export default BaggageCalculator; 