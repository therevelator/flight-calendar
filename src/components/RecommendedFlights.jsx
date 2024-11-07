import React from 'react';
import moment from 'moment';

const RecommendedFlights = ({ recommendation, formatPrice, formatTime, onSelect }) => {
  if (!recommendation) return null;

  return (
    <div className="recommended-flights">
      <h3>💡 Cheapest {recommendation.return ? 'Return' : 'Single'} Flight Option</h3>
      <div className="flight-details">
        <div className="flight">
          <div className="flight-date">
            Outbound: {moment(recommendation.outbound.day).format('ddd, MMM D')}
          </div>
          <div className="flight-time">
            {formatTime(recommendation.outbound.departureDate)} - {formatTime(recommendation.outbound.arrivalDate)}
          </div>
          <div className="flight-price">
            {formatPrice(recommendation.outbound.price)}
          </div>
        </div>
        {recommendation.return && (
          <>
            <div className="flight-separator">→</div>
            <div className="flight">
              <div className="flight-date">
                Return: {moment(recommendation.return.day).format('ddd, MMM D')}
              </div>
              <div className="flight-time">
                {formatTime(recommendation.return.departureDate)} - {formatTime(recommendation.return.arrivalDate)}
              </div>
              <div className="flight-price">
                {formatPrice(recommendation.return.price)}
              </div>
            </div>
          </>
        )}
      </div>
      {recommendation.totalPrice && (
        <div className="total-price">
          Total: {formatPrice({ ...recommendation.outbound.price, value: recommendation.totalPrice })}
        </div>
      )}
      <button onClick={() => onSelect(recommendation)} className="select-flights">
        Select {recommendation.return ? 'These Flights' : 'This Flight'}
      </button>
    </div>
  );
};

export default RecommendedFlights; 