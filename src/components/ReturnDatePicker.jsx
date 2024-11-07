import React from 'react';
import moment from 'moment';

const ReturnDatePicker = ({ 
  returnFlightData, 
  selectedDate, 
  onDateSelect, 
  outboundDate,
  formatPrice,
  onFlightSelect,
  getBackgroundColor,
  formatTime,
  onMonthChange 
}) => {
  if (!returnFlightData || !returnFlightData.outbound) return <div>Loading return flights...</div>;
  
  const minPrice = returnFlightData.outbound.minFare?.price?.value || 0;
  const maxPrice = returnFlightData.outbound.maxFare?.price?.value || 0;

  const current = moment(selectedDate || outboundDate).add(1, 'day');
  const startOfMonth = current.clone().startOf('month');
  const endOfMonth = current.clone().endOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = endOfMonth.clone().endOf('week');
  
  const handlePrevMonth = () => {
    const prevMonth = current.clone().subtract(1, 'month');
    onMonthChange(prevMonth.format('YYYY-MM-DD'));
  };

  const handleNextMonth = () => {
    const nextMonth = current.clone().add(1, 'month');
    onMonthChange(nextMonth.format('YYYY-MM-DD'));
  };
  
  const weeks = [];
  let days = [];
  let day = startDate.clone();
  
  while (day.isBefore(endDate)) {
    for (let i = 0; i < 7; i++) {
      const fare = returnFlightData.outbound.fares.find(f => 
        moment(f.day).isSame(day, 'day')
      );
      
      const isBeforeOutbound = day.isSameOrBefore(outboundDate, 'day');
      const isDisabled = isBeforeOutbound || !fare || fare.unavailable;
      
      days.push({
        date: day.clone(),
        fare,
        isDisabled
      });
      day.add(1, 'day');
    }
    weeks.push(days);
    days = [];
  }

  return (
    <div className="return-date-picker">
      <div className="calendar-nav">
        <button onClick={handlePrevMonth}>&larr;</button>
        <h2>{current.format('MMMM YYYY')}</h2>
        <button onClick={handleNextMonth}>&rarr;</button>
      </div>
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
        {weeks.flat().map(({ date, fare, isDisabled }) => (
          <div
            key={date.format('YYYY-MM-DD')}
            className={`calendar-cell ${isDisabled ? 'unavailable' : ''} 
                      ${date.format('YYYY-MM-DD') === selectedDate ? 'selected' : ''}`}
            style={{
              backgroundColor: !isDisabled ? getBackgroundColor(
                fare?.price?.value,
                minPrice,
                maxPrice
              ) : undefined
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDisabled) {
                onFlightSelect(date.format('YYYY-MM-DD'), fare);
                onDateSelect(date.format('YYYY-MM-DD'));
              }
            }}
          >
            <div className="date">{date.date()}</div>
            {!isDisabled && fare?.price && (
              <>
                <div className="price">{formatPrice(fare.price)}</div>
                {fare.departureDate && (
                  <div className="flight-times">
                    {formatTime(fare.departureDate)} - {formatTime(fare.arrivalDate)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnDatePicker; 