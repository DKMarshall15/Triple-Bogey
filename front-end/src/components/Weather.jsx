import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import useGeolocation from "./useGeolocation";

const WeatherBanner = ({ lat, lon, locationName }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const { location, error: geoError } = useGeolocation();
  
  // Cache ref to store previous location
  const lastLocationRef = useRef(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Use provided coordinates or fallback to geolocation
  const weatherLocation = lat && lon ? { latitude: lat, longitude: lon } : location;
  const weatherError = lat && lon ? null : geoError;

  useEffect(() => {
    // Only fetch weather if we have location data
    if (!weatherLocation) return;

    const currentLocation = `${weatherLocation.latitude},${weatherLocation.longitude}`;
    const now = Date.now();

    // Check if we should skip the API call
    const shouldSkipFetch = 
      lastFetchTime && 
      (now - lastFetchTime) < CACHE_DURATION && 
      lastLocationRef.current === currentLocation &&
      forecast.length > 0; // Only skip if we have cached data

    if (shouldSkipFetch) {
      console.log("Using cached weather data");
      return;
    }

    const fetchWeather = async () => {
      try {
        console.log("Fetching fresh weather data");
        const url = `https://api.openweathermap.org/data/2.5/forecast`;
        const response = await axios.get(url, {
          params: {
            lat: weatherLocation.latitude,
            lon: weatherLocation.longitude,
            appid: API_KEY,
            units: "imperial",
          },
          timeout: 5000, // 5 seconds timeout
        });
        const dailyData = processedForecast(response.data.list);
        setForecast(dailyData);
        setCityName(response.data.city.name);
        setLastFetchTime(now);
        lastLocationRef.current = currentLocation;
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("Unable to load weather.");
      }
    };

    fetchWeather();
  }, [weatherLocation?.latitude, weatherLocation?.longitude, API_KEY]); // More specific dependencies

  const processedForecast = (list) => {
    const daily = {};
    list.forEach((forecast) => {
      const [date, time] = forecast.dt_txt.split(" ");
      if (time === "12:00:00" && !daily[date]) {
        daily[date] = forecast;
      }
    });

    return Object.values(daily).slice(0, 5); // Only 5 days
  };

  // Determine display name: use provided locationName, then cityName from API, then fallback
  const displayName = locationName || cityName;

  // Show loading state while getting location (only if using geolocation)
  if (!weatherLocation && !weatherError && !lat && !lon) {
    return (
      <Container sx={{ pb: 2, borderRadius: 2, bgcolor: '#f5f5dc' }}>
        <Typography variant="h5">Getting your location...</Typography>
      </Container>
    );
  }

  // Show geolocation error (only if using geolocation)
  if (weatherError && !lat && !lon) {
    return (
      <Container sx={{ pb: 2, borderRadius: 2, bgcolor: '#f5f5dc' }}>
        <Typography variant="h5" color="error">
          Location Error: {weatherError}
        </Typography>
      </Container>
    );
  }

  // Show error if coordinates provided but invalid
  if (lat && lon && !weatherLocation) {
    return (
      <Container sx={{ pb: 2, borderRadius: 2, bgcolor: '#f5f5dc' }}>
        <Typography variant="h5" color="error">
          Invalid coordinates provided
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ pb: 2, borderRadius: 2, bgcolor: 'secondary.main' }}>
        <Typography variant="h5">
          5-Day Weather Forecast{displayName ? ` for ${displayName}` : ''}
          {lastFetchTime && (
            <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.7 }}>
              Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
            </Typography>
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-evenly" }}>
            {error ? (
                <Typography color="error">{error}</Typography>
            ) : forecast.length === 0 ? (
                <Typography>Loading weather data...</Typography>
            ) : (
                forecast.map(day => (
                    <Box
                        key={day.dt}
                        sx={{
                            minWidth: 120,
                            textAlign: "center",
                            border: 1,
                            borderRadius: 2,
                            p: 2,
                            bgcolor: "primary.main",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Box sx={{ position: "relative", width: 90, height: 80 }}>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}
                                alt={day.weather[0].description}
                                width={80}
                                height={80}
                                style={{ display: "block", position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }}
                            />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    position: "absolute",
                                    top: -12,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    px: 1,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    fontSize: "0.6rem",
                                    width: "100%"
                                }}
                            >
                                High {Math.round(day.main.temp_max)}°F / Low {Math.round(day.main.temp_min)}°F
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    position: "absolute",
                                    bottom: -12,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    bgcolor: "rgba(255,255,255,0.8)",
                                    px: 1,
                                    borderRadius: 1,
                                    fontWeight: 500,
                                    fontSize: "0.95rem",
                                    width: "100%"
                                }}
                            >
                                {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </Typography>
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    </Container>
  );
};

export default WeatherBanner;
