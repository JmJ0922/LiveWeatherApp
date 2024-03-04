const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;


app.use(express.json());

app.post('/api/weather', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const location = await getLocation(latitude, longitude);
    const weatherData = await getWeather(latitude, longitude);
    res.json({ location, ...weatherData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

io.on('connection', async (socket) => {
  console.log('Client connected');

  try {
    // Fetch initial weather data
    const initialWeatherData = await getWeatherData();
    socket.emit('initialData', initialWeatherData);

    // Set up interval to fetch new weather data every 30 seconds
    setInterval(async () => {
      try {
        const updatedWeatherData = await getWeatherData();
        socket.emit('update', updatedWeatherData);
      } catch (error) {
        console.error('Error fetching updated weather data:', error);
      }
    }, 30000);
  } catch (error) {
    console.error('Error fetching initial weather data:', error);
  }
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function getLocation(latitude, longitude) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const { address } = response.data;
        
        // Construct location name from address components
        let locationName = "";
        if (address.city) {
            locationName += address.city + ", ";
        }
        if (address.state) {
            locationName += address.state + ", ";
        }
        if (address.country) {
            locationName += address.country;
        }
        
        return locationName.trim();
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
}

  

async function getWeather(latitude, longitude) {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e70bfe242b2d7f317b5352a6f448890e`);
      const { main, weather } = response.data;
      return { temperature: main.temp, conditions: weather[0].description };
    } catch (error) {
      throw error;
    }
  }
  

