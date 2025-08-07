import { Box, Container, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

const WeatherBanner = ({ lat, lon }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  console.log("Weather API Key:", API_KEY);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast`;
        const response = await axios.get(url, {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: "imperial",
          },
        });
        const dailyData = processedForecast(response.data.list);
        setForecast(dailyData);
      } catch (err) {
        console.error("Weather fetch failed:", err);
        setError("Unable to load weather.");
      }
    };

    fetchWeather();
  }, [lat, lon]);

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

return (
    <Container sx={{ pb: 2, borderRadius: 2, bgcolor: '#f5f5dc' }}>
        <Typography variant="h5">5-Day Weather Forecast</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "space-evenly" }}>
            {error ? (
                <Typography color="error">{error}</Typography>
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
                            bgcolor: "#20c31bff",
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
