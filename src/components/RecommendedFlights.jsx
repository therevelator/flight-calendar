import React from 'react';
import moment from 'moment';

const RecommendedFlights = ({ recommendation, formatPrice, formatTime, onSelect }) => {
  if (!recommendation) return null;

  const handleSelectFlights = () => {
    // First select the outbound flight
    onSelect(recommendation.outbound.day, recommendation.outbound);

    // If it's a return flight, select it after a short delay
    // This ensures the outbound is processed first
    if (recommendation.return) {
      setTimeout(() => {
        onSelect(recommendation.return.day, recommendation.return, true);
      }, 100);
    }
  };

  // Calculate total price only if all price values exist
  const totalPrice = recommendation.outbound?.price && {
    value: recommendation.outbound.price.value + (recommendation.return?.price?.value || 0),
    currencySymbol: recommendation.outbound.price.currencySymbol,
    currencyCode: recommendation.outbound.price.currencyCode
  };

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
      {totalPrice && (
        <div className="total-price">
          Total: {formatPrice(totalPrice)}
        </div>
      )}
      <button className="select-flights" onClick={handleSelectFlights}>
        Select Flights
      </button>
    </div>
  );
};

export default RecommendedFlights; 