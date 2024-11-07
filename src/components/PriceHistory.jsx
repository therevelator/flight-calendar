import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const PriceHistory = ({ flightData }) => {
  if (!flightData?.outbound?.fares) return null;

  const data = flightData.outbound.fares
    .filter(fare => !fare.unavailable)
    .map(fare => ({
      date: moment(fare.day).format('MMM D'),
      price: fare.price.value
    }))
    .sort((a, b) => moment(a.date).diff(moment(b.date)));

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;

  return (
    <div className="price-history">
      <h3>📊 Price History</h3>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="price-stats">
        <div>Lowest: €{minPrice.toFixed(2)}</div>
        <div>Average: €{avgPrice.toFixed(2)}</div>
        <div>Highest: €{maxPrice.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default PriceHistory; 