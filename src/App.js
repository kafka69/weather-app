import React, { useEffect, useState } from 'react';
import './App.css'; // Assuming you're using Tailwind or your custom CSS

const api = {
  key: "67fe479fd8768637028f8e2f3a47084a",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!searchCity) return;
      setLoading(true);
      
      try {
        const url = `${api.base}weather?q=${searchCity}&units=metric&APPID=${api.key}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          setWeatherInfo({
            city: data.name,
            country: data.sys.country,
            description: data.weather[0].description,
            temp: data.main.temp,
            icon: data.weather[0].icon
          });
          setErrorMessage("");
        } else {
          setErrorMessage(data.message);
          setWeatherInfo(null);
        }
      } catch (error) {
        setErrorMessage(error.message);
        setWeatherInfo(null);
      }
      
      setLoading(false);
    };

    fetchWeatherData();
  }, [searchCity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchCity(searchInput);
  };

  return (
    <div className="container">
    <div className="card">
      <form className="flex flex-col items-center mb-8" onSubmit={handleSubmit}>
        <input
          type="text"
          className="p-2 rounded-lg shadow-lg focus:outline-none mb-4"
          placeholder="Enter city"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="text-lg text-gray-700">Loading...</div>
      ) : errorMessage ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : weatherInfo ? (
        <div className="weather-card">
          <h2>{weatherInfo.city}, {weatherInfo.country}</h2>
          <img src={`http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`} alt={weatherInfo.description} />
          <p>{weatherInfo.description}</p>
          <p>{weatherInfo.temp}°C</p>
        </div>
      ) : (
        <div>Enter a city to get the weather information</div>
      )}
    </div>
  </div>
  );
}

export default App;
