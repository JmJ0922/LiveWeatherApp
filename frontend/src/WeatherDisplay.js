// WeatherDisplay.js
import React from 'react';

const WeatherDisplay = ({ data }) => {
  const { location, temperature, conditions } = data;

  // Convert temperature from Kelvin to Celsius
  const temperatureInCelsius = temperature - 273.15;
  

  return (
    <div className='weather-container'>
      <h2>Location: {location}</h2>
      <p>Temperature: {temperatureInCelsius.toFixed(2)}°C</p>
      <p>Conditions: {conditions}</p>
    </div>
  );
};

export default WeatherDisplay;
