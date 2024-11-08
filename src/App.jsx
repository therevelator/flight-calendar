import { useState, useEffect } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import ReturnDatePicker from './components/ReturnDatePicker';
import RecommendedFlights from './components/RecommendedFlights';
import PriceHistory from './components/PriceHistory';
import WeatherForecast from './components/WeatherForecast';
import moment from 'moment';

function App() {
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    origin: 'DUB',
    destination: 'OTP',
    date: '2024-12-01',
    currency: 'EUR'
  });
  const [destinations, setDestinations] = useState([]);
  const [originAirports, setOriginAirports] = useState([]);
  const [bookingParams, setBookingParams] = useState({
    adults: 1,
    teens: 0,
    children: 0,
    infants: 0,
    isReturn: false,
    isConnectedFlight: false,
    discount: 0,
    promoCode: '',
    dateIn: '' // For return flights
  });
  const [returnFlightData, setReturnFlightData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const currencies = [
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'USD', symbol: '$' },
  ];

  useEffect(() => {
    fetchFlightData();
  }, [searchParams]);

  useEffect(() => {
    fetchDestinations(searchParams.origin);
  }, [searchParams.origin]);

  useEffect(() => {
    fetchOriginAirports();
  }, []);

  useEffect(() => {
    if (bookingParams.isReturn) {
      fetchReturnFlights(searchParams.date);
    }
  }, [bookingParams.isReturn, searchParams.origin, searchParams.destination, searchParams.date, searchParams.currency]);

  useEffect(() => {
    fetchWeatherData(searchParams.destination, searchParams.date);
  }, [searchParams.destination, searchParams.date]);

  const fetchFlightData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${searchParams.origin}/${searchParams.destination}/cheapestPerDay?outboundMonthOfDate=${searchParams.date}&currency=${searchParams.currency}`
      );
      const data = await response.json();
      setFlightData(data);
    } catch (error) {
      console.error('Error fetching flight data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async (originAirport) => {
    try {
      const response = await fetch(
        `https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/${originAirport}`
      );
      const data = await response.json();
      const formattedDestinations = data.map(item => ({
        code: item.arrivalAirport.code,
        name: item.arrivalAirport.name,
        city: item.arrivalAirport.city.name
      }));
      setDestinations(formattedDestinations);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setDestinations([]);
    }
  };

  const fetchOriginAirports = async () => {
    try {
      // First get all destinations from Dublin (a major Ryanair hub) to get a good initial list
      const response = await fetch(
        'https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/DUB'
      );
      const data = await response.json();
      
      // Extract unique airports from both origin and destinations
      const uniqueAirports = new Map();
      
      // Add Dublin as it's our initial airport
      uniqueAirports.set('DUB', {
        code: 'DUB',
        name: 'Dublin',
        city: 'Dublin'
      });
      
      // Add all destinations
      data.forEach(route => {
        const airport = route.arrivalAirport;
        if (!uniqueAirports.has(airport.code)) {
          uniqueAirports.set(airport.code, {
            code: airport.code,
            name: airport.name,
            city: airport.city?.name || airport.name
          });
        }
      });
      
      // Convert Map to array and sort by city name
      const formattedAirports = Array.from(uniqueAirports.values())
        .sort((a, b) => a.city.localeCompare(b.city));
        
      setOriginAirports(formattedAirports);
      
      // If no origin is selected yet, set the first airport as default
      if (!searchParams.origin && formattedAirports.length > 0) {
        setSearchParams(prev => ({
          ...prev,
          origin: formattedAirports[0].code
        }));
      }
    } catch (error) {
      console.error('Error fetching origin airports:', error);
      // Fallback to a few major airports if the API fails
      const fallbackAirports = [
        { code: 'DUB', name: 'Dublin', city: 'Dublin' },
        { code: 'STN', name: 'London Stansted', city: 'London' },
        { code: 'BGY', name: 'Milan Bergamo', city: 'Milan' },
        { code: 'OTP', name: 'Bucharest', city: 'Bucharest' }
      ];
      setOriginAirports(fallbackAirports);
    }
  };

  const fetchReturnFlights = async (dateOut) => {
    if (!bookingParams.isReturn || !searchParams.origin || !searchParams.destination) return;
    
    try {
      setReturnFlightData(null); // Reset data while loading
      const response = await fetch(
        `https://www.ryanair.com/api/farfnd/v4/oneWayFares/${searchParams.destination}/${searchParams.origin}/cheapestPerDay?` +
        `outboundMonthOfDate=${dateOut || searchParams.date}&currency=${searchParams.currency}`
      );
      const data = await response.json();
      setReturnFlightData(data);
    } catch (error) {
      console.error('Error fetching return flights:', error);
      setReturnFlightData(null);
    }
  };

  const fetchWeatherData = async (destination, date) => {
    try {
      // Find the destination city name from the destinations array
      const destinationCity = destinations.find(airport => 
        airport.code === destination
      )?.city || destination;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${destinationCity}&appid=4a832ba19efef92fa016634d4ec736eb&units=metric`
      );
      const data = await response.json();
      
      // Check if the API returned an error
      if (data.cod && data.cod !== 200) {
        console.error('Weather API error:', data.message);
        setWeatherData(null);
        return;
      }
      
      setWeatherData({
        main: {
          temp: data.main?.temp,
          feels_like: data.main?.feels_like,
          humidity: data.main?.humidity
        },
        wind: {
          speed: data.wind?.speed
        },
        weather: [{
          description: data.weather?.[0]?.description || 'No description available',
          icon: data.weather?.[0]?.icon || '01d'
        }]
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    }
  };

  const handleParamChange = (param, value) => {
    // Use requestAnimationFrame to maintain scroll position
    requestAnimationFrame(() => {
      setSearchParams(prev => ({ ...prev, [param]: value }));
    });
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

  // Add some opacity to make it work better with the glass effect
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
    
    // Add 80% opacity to work better with glass effect
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

  const handleFlightSelect = (date, fare, isReturn = false) => {
    if (!fare || fare.unavailable) return;
    
    // If it's a return flight, or if it's not a return flight and return is not enabled
    if (isReturn || !bookingParams.isReturn) {
      const baseUrl = 'https://www.ryanair.com/ie/en/trip/flights/select';
      const params = new URLSearchParams({
        adults: bookingParams.adults.toString(),
        teens: bookingParams.teens.toString(),
        children: bookingParams.children.toString(),
        infants: bookingParams.infants.toString(),
        dateOut: moment(isReturn ? searchParams.date : date).format('YYYY-MM-DD'),
        ...(isReturn && { dateIn: moment(date).format('YYYY-MM-DD') }),
        isConnectedFlight: 'false',
        isReturn: bookingParams.isReturn.toString(),
        discount: '0',
        promoCode: '',
        originIata: searchParams.origin,
        destinationIata: searchParams.destination,
        // Tracking parameters
        tpAdults: bookingParams.adults.toString(),
        tpTeens: bookingParams.teens.toString(),
        tpChildren: bookingParams.children.toString(),
        tpInfants: bookingParams.infants.toString(),
        tpStartDate: moment(isReturn ? searchParams.date : date).format('YYYY-MM-DD'),
        ...(isReturn && { tpEndDate: moment(date).format('YYYY-MM-DD') }),
        tpDiscount: '0',
        tpPromoCode: '',
        tpOriginIata: searchParams.origin,
        tpDestinationIata: searchParams.destination
      }).toString();

      const bookingUrl = `${baseUrl}?${params}`;
      window.open(bookingUrl, '_blank');
    } else {
      // If return is enabled but this is the outbound flight, just set the date
      handleParamChange('date', moment(date).format('YYYY-MM-DD'));
    }
  };

  const handleBookingParamChange = (param, value) => {
    setBookingParams(prev => ({ ...prev, [param]: value }));
  };

  const generateMonthOptions = () => {
    const options = [];
    const today = moment();
    
    // Generate next 12 months
    for (let i = 0; i < 12; i++) {
      const monthDate = today.clone().add(i, 'months');
      options.push({
        value: monthDate.format('YYYY-MM-DD'),
        label: monthDate.format('MMMM YYYY')
      });
    }
    
    return options;
  };

  const generatePassengerOptions = (max) => {
    return Array.from({ length: max + 1 }, (_, i) => ({
      value: i,
      label: i.toString()
    }));
  };

  const findCheapestFlights = () => {
    if (!flightData?.outbound) return null;

    const currentMonth = moment(searchParams.date).startOf('month');
    const endOfMonth = moment(searchParams.date).endOf('month');
    
    // Find cheapest outbound flight in current month
    const validOutboundFares = flightData.outbound.fares.filter(fare => {
      const fareDate = moment(fare.day);
      return !fare.unavailable && 
             fareDate.isSameOrAfter(currentMonth) && 
             fareDate.isSameOrBefore(endOfMonth);
    });
    
    if (validOutboundFares.length === 0) return null;
    
    // Sort by price and get cheapest outbound
    const cheapestOutbound = validOutboundFares.sort((a, b) => 
      a.price.value - b.price.value
    )[0];

    // If return flights are enabled and we have return flight data
    if (bookingParams.isReturn && returnFlightData?.outbound) {
      const outboundDate = moment(cheapestOutbound.day);
      const validReturnFares = returnFlightData.outbound.fares.filter(fare => {
        const fareDate = moment(fare.day);
        return !fare.unavailable && 
               fareDate.isAfter(outboundDate) && 
               fareDate.isSameOrBefore(endOfMonth);
      });
      
      if (validReturnFares.length === 0) return { outbound: cheapestOutbound };
      
      const cheapestReturn = validReturnFares.sort((a, b) => 
        a.price.value - b.price.value
      )[0];
      
      return {
        outbound: cheapestOutbound,
        return: cheapestReturn,
        totalPrice: cheapestOutbound.price.value + cheapestReturn.price.value
      };
    }
    
    // For single flights
    return { outbound: cheapestOutbound };
  };

  // First, get the selected flight from the flight data
  const getSelectedFlight = () => {
    if (!flightData?.outbound?.fares) return null;
    return flightData.outbound.fares.find(fare => fare.day === searchParams.date);
  };

  if (loading) return <div className="loading">Loading flights...</div>;
  if (!flightData || !flightData.outbound) return <div className="error">Error loading flight data</div>;

  // Only calculate these if we have valid data
  const minPrice = flightData.outbound.minFare?.price?.value || 0;
  const maxPrice = flightData.outbound.maxFare?.price?.value || 0;

  return (
    <div className="app" onSubmit={(e) => e.preventDefault()}>
      <h1>Flight Price Calendar</h1>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="origin">From</label>
          <select
            id="origin"
            value={searchParams.origin}
            onChange={(e) => handleParamChange('origin', e.target.value)}
          >
            {originAirports.map(airport => (
              <option key={airport.code} value={airport.code}>
                {airport.name} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="destination">To</label>
          <select
            id="destination"
            value={searchParams.destination}
            onChange={(e) => handleParamChange('destination', e.target.value)}
          >
            {destinations.map(airport => (
              <option key={airport.code} value={airport.code}>
                {airport.name} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Month</label>
          <select
            value={searchParams.date.substring(0, 10)}
            onChange={(e) => handleParamChange('date', e.target.value)}
          >
            {generateMonthOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={searchParams.currency}
            onChange={(e) => handleParamChange('currency', e.target.value)}
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.code} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="booking-controls">
          <h3>Booking Options</h3>
          
          <div className="control-group">
            <label>Passengers</label>
            <div className="passenger-controls">
              <div>
                <label htmlFor="adults">Adults</label>
                <select
                  id="adults"
                  value={bookingParams.adults}
                  onChange={(e) => handleBookingParamChange('adults', parseInt(e.target.value))}
                >
                  {generatePassengerOptions(6).slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="teens">Teens</label>
                <select
                  id="teens"
                  value={bookingParams.teens}
                  onChange={(e) => handleBookingParamChange('teens', parseInt(e.target.value))}
                >
                  {generatePassengerOptions(6).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="children">Children</label>
                <select
                  id="children"
                  value={bookingParams.children}
                  onChange={(e) => handleBookingParamChange('children', parseInt(e.target.value))}
                >
                  {generatePassengerOptions(6).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="infants">Infants</label>
                <select
                  id="infants"
                  value={bookingParams.infants}
                  onChange={(e) => handleBookingParamChange('infants', parseInt(e.target.value))}
                >
                  {generatePassengerOptions(6).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="promoCode">Promo Code</label>
            <input
              type="text"
              id="promoCode"
              value={bookingParams.promoCode}
              onChange={(e) => handleBookingParamChange('promoCode', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Calendar 
        flightData={flightData}
        currentDate={searchParams.date}
        onDateSelect={(date, event) => handleParamChange('date', date, event)}
        onMonthChange={(date, event) => handleParamChange('date', date, event)}
        onFlightSelect={handleFlightSelect}
        isReturnActive={bookingParams.isReturn}
      />

      <div className="return-flight-section">
        <div className="control-group">
          <label htmlFor="isReturn">
            <input
              type="checkbox"
              id="isReturn"
              checked={bookingParams.isReturn}
              onChange={(e) => handleBookingParamChange('isReturn', e.target.checked)}
            />
            Add Return Flight
          </label>
        </div>

        {bookingParams.isReturn && (
          <div className="control-group return-date">
            <ReturnDatePicker
              returnFlightData={returnFlightData}
              selectedDate={bookingParams.dateIn}
              onDateSelect={(date) => handleBookingParamChange('dateIn', date)}
              outboundDate={searchParams.date}
              formatPrice={formatPrice}
              onFlightSelect={(date, fare) => handleFlightSelect(date, fare, true)}
              getBackgroundColor={getBackgroundColor}
              formatTime={formatTime}
              onMonthChange={(date) => {
                handleBookingParamChange('dateIn', date);
                fetchReturnFlights(date);
              }}
            />
          </div>
        )}
      </div>
      
      <RecommendedFlights
        recommendation={findCheapestFlights()}
        formatPrice={formatPrice}
        formatTime={formatTime}
        onSelect={handleFlightSelect}
      />

      <div className="weather-container">
        <WeatherForecast 
          destination={searchParams.destination}
          date={searchParams.date}
          weatherData={weatherData}
        />
      </div>

      <div className="price-history-container">
        <PriceHistory flightData={flightData} />
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#00FF5E' }}></div>
          <span>≤ €50</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFC107' }}></div>
          <span>€100</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FF3D3D' }}></div>
          <span>≥ €150</span>
        </div>
      </div>
    </div>
  );
}

export default App; 