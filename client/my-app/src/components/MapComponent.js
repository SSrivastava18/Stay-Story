import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MapComponent = ({ location }) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchCoords = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError('Location not found.');
        }
      } catch (err) {
        setError('Failed to fetch coordinates.');
      }
    };

    fetchCoords();
  }, [location]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div style={{ height: '450px', width: '100%', marginTop: '20px' }}>
      {coords ? (
        <MapContainer center={coords} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={coords} icon={customIcon}>
            <Popup>{location}</Popup>
          </Marker>
        </MapContainer>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', paddingTop: '50px' }}>{error}</div>
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>Loading map...</div>
      )}

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
            View in Google Maps
          </button>
        </a>
      </div>
    </div>
  );
};

export default MapComponent;
