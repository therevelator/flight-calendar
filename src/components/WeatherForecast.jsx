import React from 'react';
import './Weather.css';
import moment from 'moment';

const WeatherForecast = ({ destination, date, weatherData }) => {
  // Early return if no weather data
  if (!weatherData || !weatherData.main) return null;

  // Safely destructure the weather data with default values
  const {
    main: { 
      temp = 'N/A', 
      feels_like = 'N/A', 
      humidity = 'N/A' 
    } = {},
    wind: { 
      speed: wind_speed = 'N/A' 
    } = {},
    weather: [{ 
      description = 'No data available', 
      icon = '01d' // default icon
    } = {}] = [{}]
  } = weatherData;

  return (
    <div className="weather-widget">
      <div className="weather-icon-section">
        <img 
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={description}
          className="weather-icon"
        />
        <div className="weather-temp">
          {typeof temp === 'number' ? `${Math.round(temp)}°C` : 'N/A'}
        </div>
        <div className="weather-description">
          {description}
        </div>
      </div>

      <div className="weather-content">
        <div className="location-info">
          <h3>{destination}</h3>
          <span className="date">{moment(date).format('MMM D, YYYY')}</span>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <svg className="weather-detail-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z" />
            </svg>
            <div className="weather-detail-info">
              <span className="weather-detail-label">Feels Like</span>
              <span className="weather-detail-value">
                {typeof feels_like === 'number' ? `${Math.round(feels_like)}°C` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="weather-detail">
            <svg className="weather-detail-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21" />
            </svg>
            <div className="weather-detail-info">
              <span className="weather-detail-label">Humidity</span>
              <span className="weather-detail-value">
                {typeof humidity === 'number' ? `${humidity}%` : 'N/A'}
              </span>
            </div>
          </div>

          <div className="weather-detail">
            <svg className="weather-detail-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z" />
            </svg>
            <div className="weather-detail-info">
              <span className="weather-detail-label">Wind Speed</span>
              <span className="weather-detail-value">
                {typeof wind_speed === 'number' ? `${Math.round(wind_speed)} km/h` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;