import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '450px',
  marginTop: '20px',
};

const MapComponent = ({ location }) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBtrcYLw3SaRnaXHmMICHqJnqDpT5kvCE4'; 

  useEffect(() => {
    if (!location) return;

    const fetchCoords = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoords({ lat, lng });
        } else {
          setError('Location not found.');
        }
      } catch (err) {
        setError('Failed to fetch coordinates.');
      }
    };

    fetchCoords();
  }, [location]);

  const googleMapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
    : '#';

  return (
    <div style={{ width: '100%' }}>
      {coords ? (
        <>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coords}
              zoom={13}
            >
              <Marker position={coords} />
            </GoogleMap>
          </LoadScript>

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                See on Google Maps
              </button>
            </a>
          </div>
        </>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', paddingTop: '50px' }}>{error}</div>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>Loading map...</div>
      )}
    </div>
  );
};

export default MapComponent;
