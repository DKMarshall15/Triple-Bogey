import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, Typography, Button } from '@mui/material';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

const MapboxExample = ({ latitude, longitude, courseName }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const originalCenterRef = useRef(); // Store original coordinates

  // Function to re-center the map
  const handleReCenter = () => {
    if (mapRef.current && originalCenterRef.current) {
      mapRef.current.flyTo({
        center: originalCenterRef.current,
        zoom: 15,
        duration: 1000 // Smooth animation duration in ms
      });
    }
  };

  useEffect(() => {
    // Check if access token exists
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Mapbox access token not found');
      return;
    }
    
    mapboxgl.accessToken = accessToken;

    // Check WebGL support more thoroughly
    if (!mapboxgl.supported()) {
      console.error('Mapbox GL is not supported in this browser');
      return;
    }

    // Check if we have valid coordinates before proceeding
    if (!latitude || !longitude) {
      console.log('No coordinates provided for map');
      return;
    }

    // Only initialize if container exists and map hasn't been created
    if (mapContainerRef.current && !mapRef.current) {
      try {
        const center = [longitude, latitude];
        originalCenterRef.current = center; // Store original center
        
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/marshae/cmeh7fiza00o801s4bmuhc7bd', 
          center: center,
          zoom: 15,
          antialias: false, // Disable antialiasing to reduce WebGL load
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        });

        // Wait for map to load before adding marker
        mapRef.current.on('load', () => {
          console.log('Map loaded successfully');
          
          // Add a marker for the golf course
          new mapboxgl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${courseName || 'Golf Course'}</h3>`)
            )
            .addTo(mapRef.current);
        });

        // Add error event listener
        mapRef.current.on('error', (e) => {
          console.error('Map error:', e);
        });

        // Add style load error handler
        mapRef.current.on('styleimagemissing', (e) => {
          console.warn('Missing style image:', e.id);
        });

      } catch (error) {
        console.error('Error creating map:', error);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, courseName]);

  // Check if browser supports WebGL
  if (!mapboxgl.supported()) {
    return (
      <Box 
        sx={{ 
          height: '400px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography>
          Your browser doesn't support WebGL required for maps.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Re-center Button */}
      <Button
        variant="contained"
        onClick={handleReCenter}
        startIcon={<CenterFocusStrongIcon />}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          boxShadow: 2,
          minWidth: 'auto',
          px: 2
        }}
      >
        Re-center
      </Button>
      
      {/* Map Container */}
      <Box 
        ref={mapContainerRef} 
        id="map" 
        sx={{ 
          height: '700px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: 1
        }} 
      />
    </Box>
  );
};

export default MapboxExample;