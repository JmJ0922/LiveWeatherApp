// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDisplay from './WeatherDisplay';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location = await getLocation();
        const response = await axios.post('/api/weather', location);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    });
  };

  return (
    <div className="App">
      <div></div>
      {weatherData && <WeatherDisplay data={weatherData} />}
    </div>
  );
};

export default App;
