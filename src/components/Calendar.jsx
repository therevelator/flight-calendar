import React from 'react';
import moment from 'moment';
import './Calendar.css';

const Calendar = ({ flightData, currentDate, onDateSelect, onFlightSelect, isReturnActive }) => {
  if (!flightData) return null;
  
  const current = moment(currentDate);
  const startOfMonth = current.clone().startOf('month');
  const endOfMonth = current.clone().endOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = endOfMonth.clone().endOf('week');
  
  const weeks = [];
  let days = [];
  let day = startDate.clone();
  
  while (day.isBefore(endDate)) {
    for (let i = 0; i < 7; i++) {
      const fare = flightData.outbound.fares.find(f => 
        moment(f.day).isSame(day, 'day')
      );
      
      days.push({
        date: day.clone(),
        fare
      });
      day.add(1, 'day');
    }
    weeks.push(days);
    days = [];
  }

  const handleCellClick = (e, date, fare) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!fare?.unavailable) {
      setTimeout(() => {
        onFlightSelect(date.format('YYYY-MM-DD'), fare);
        onDateSelect(date.format('YYYY-MM-DD'));
      }, 0);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-nav">
        {/* ... navigation content ... */}
      </div>
      <div className="calendar">
        <div className="calendar-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        <div className="calendar-grid">
          {weeks.flat().map(({ date, fare }) => (
            <div
              key={date.format('YYYY-MM-DD')}
              className={`calendar-cell 
                ${fare?.unavailable ? 'unavailable' : ''} 
                ${date.format('YYYY-MM-DD') === currentDate && isReturnActive ? 'outbound-selected' : ''}`}
              style={{
                backgroundColor: fare?.unavailable ? undefined : getBackgroundColor(
                  fare?.price?.value,
                  flightData.outbound.minFare?.price?.value,
                  flightData.outbound.maxFare?.price?.value
                )
              }}
              onClick={(e) => handleCellClick(e, date, fare)}
            >
              <div className="date">{date.date()}</div>
              {!fare?.unavailable && fare?.price && (
                <>
                  <div className="price">{formatPrice(fare.price)}</div>
                  {fare.departureDate && (
                    <div className="flight-times">
                      {formatTime(fare.departureDate)} - {formatTime(fare.arrivalDate)}
                    </div>
                  )}
                </>
              )}
              {date.format('YYYY-MM-DD') === currentDate && isReturnActive && (
                <div className="selected-mark">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getBackgroundColor = (price, minPrice, maxPrice) => {
  if (!price) return 'transparent';
  
  // Define our color stops with brighter colors
  const colors = {
    cheap: '#00FF5E',    // Bright green for ≤ 50€
    medium: '#FFC107',   // Bright amber for ~100€
    expensive: '#FF3D3D' // Bright red for ≥150€
  };

  if (price <= 50) {
    return colors.cheap;
  } else if (price <= 100) {
    // Interpolate between green and orange
    const percent = (price - 50) / 50;
    return interpolateColor(colors.cheap, colors.medium, percent);
  } else if (price <= 150) {
    // Interpolate between orange and red
    const percent = (price - 100) / 50;
    return interpolateColor(colors.medium, colors.expensive, percent);
  } else {
    return colors.expensive;
  }
};

const interpolateColor = (color1, color2, factor) => {
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `rgba(${r}, ${g}, ${b}, 0.8)`;
};

const formatPrice = (price) => {
  if (!price) return 'N/A';
  return `${price.currencySymbol}${price.value.toFixed(2)}`;
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};

export default Calendar; 