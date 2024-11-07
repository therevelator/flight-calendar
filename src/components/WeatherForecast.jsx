import React, { useState, useEffect } from 'react';
import moment from 'moment';

const WeatherForecast = ({ destination, date, arrivalTime }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cityMap = {
    'DUB': 'Dublin,IE',
    'OTP': 'Bucharest,RO',
    'STN': 'London,UK',
    'BGY': 'Milan,IT'
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!destination || !cityMap[destination]) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityMap[destination]}&appid=4a832ba19efef92fa016634d4ec736eb&units=metric`
        );
        
        if (!response.ok) throw new Error('Weather data not available');
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Could not load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  if (loading) return <div className="weather-forecast">Loading weather...</div>;
  if (error) return <div className="weather-forecast">{error}</div>;
  if (!weather) return null;

  // Find forecast closest to arrival time
  const arrivalDateTime = moment(`${date} ${arrivalTime}`, 'YYYY-MM-DD HH:mm');
  const selectedDateForecast = weather.list.reduce((closest, forecast) => {
    const forecastTime = moment(forecast.dt * 1000);
    const currentDiff = Math.abs(arrivalDateTime.diff(forecastTime));
    const closestDiff = Math.abs(arrivalDateTime.diff(moment(closest.dt * 1000)));
    return currentDiff < closestDiff ? forecast : closest;
  }, weather.list[0]);

  const getWeatherIcon = (code) => {
    const iconMap = {
      '01d': '☀️',  // clear sky day
      '01n': '🌙',  // clear sky night
      '02d': '⛅',  // few clouds day
      '02n': '☁️',  // few clouds night
      '03d': '☁️',  // scattered clouds
      '03n': '☁️',  // scattered clouds
      '04d': '☁️',  // broken clouds
      '04n': '☁️',  // broken clouds
      '09d': '🌧️',  // shower rain
      '09n': '🌧️',  // shower rain
      '10d': '🌦️',  // rain day
      '10n': '🌧️',  // rain night
      '11d': '⛈️',  // thunderstorm
      '11n': '⛈️',  // thunderstorm
      '13d': '🌨️',  // snow
      '13n': '🌨️',  // snow
      '50d': '🌫️',  // mist
      '50n': '🌫️',  // mist
    };
    return iconMap[code] || '🌡️';
  };

  const arrivalTimeFormatted = moment(selectedDateForecast.dt * 1000).format('HH:mm');

  return (
    <div className="weather-forecast">
      <h3>Weather at Arrival in {weather.city.name}</h3>
      <div className="arrival-time">Expected arrival: {arrivalTimeFormatted}</div>
      <div className="weather-content">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(selectedDateForecast.weather[0].icon)}
          </div>
          <div className="temperature">
            {Math.round(selectedDateForecast.main.temp)}°C
          </div>
          <div className="description">
            {selectedDateForecast.weather[0].description}
          </div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span>💧 Humidity</span>
            <span>{selectedDateForecast.main.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span>💨 Wind</span>
            <span>{Math.round(selectedDateForecast.wind.speed * 3.6)} km/h</span>
          </div>
          <div className="weather-detail">
            <span>🌡️ Feels like</span>
            <span>{Math.round(selectedDateForecast.main.feels_like)}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;