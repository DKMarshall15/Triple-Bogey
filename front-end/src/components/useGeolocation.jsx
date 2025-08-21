import { useState, useEffect } from "react";

export default function useGeolocation(enableHighAccuracy = true) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // Success callback
    const success = (pos) => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy, // meters
        timestamp: pos.timestamp,
      });
    };

    // Error callback
    const failure = (err) => {
      setError(err.message);
    };

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(success, failure, {
      enableHighAccuracy,
      maximumAge: 0,
      timeout: 10000,
    });

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enableHighAccuracy]);

  return { location, error };
}
