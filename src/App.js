import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import arcgisToGeoJSON from '@esri/arcgis-to-geojson-utils';
import L from 'leaflet';
import './App.css';
import { useNavigate } from 'react-router-dom';

const center = [55.577525, 13.052322];

const infrastructureNames = [
  'Path', 'Compost area', 'Pond', 'Tools1', 'Tools2', 'Tools3', 'Kitchen Garden-Path',
  'Fridge', 'Farm Shop', 'Washing Station', 'Fire area', 'Building,Restaurant,Kitchen', 'Pergola', 'Pots area'
];

function ZoomListener() {
  const map = useMap();
  useEffect(() => {
    const updateLabelFontSize = () => {
      const zoom = map.getZoom();
      const minZoom = 18, maxZoom = 22;
      const minFontSize = 2, maxFontSize = 16;
      const newSize = ((zoom - minZoom) / (maxZoom - minZoom)) * (maxFontSize - minFontSize) + minFontSize;
      document.documentElement.style.setProperty('--label-font-size', `${newSize}px`);
    };
    updateLabelFontSize();
    map.on('zoomend', updateLabelFontSize);
    return () => map.off('zoomend', updateLabelFontSize);
  }, [map]);
  return null;
}

function FitBounds({ geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData) {
      const layer = L.geoJSON(geoData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geoData, map]);
  return null;
}

const getStyle = (feature) => {
  const typeColors = {
    Building: '#D2B48C',
    'Container-Tools': '#D3D3D3',
    'Container-Micro Green': '#90EE90',
    'Container-Farm Shop': '#A0522D',
    'Container-Fridge': '#ADD8E6',
    'Container-Mushroom': '#F5F5DC',
    Crop: '#8B4513',
    Deck: '#CD853F',
    'Forest Garden': '#228B22',
    'Forest Garden-Compost': '#A9A9A9',
    'Forest Garden-Eld Plats': '#D2B48C',
    'GreenHouse': '#FFFFFF',
    'Green House-Small': '#F5F5DC',
    'Green House-Pots': '#C3B091',
    'Kitchen garden': '#008000',
    'Kitchen Garden-Compost': '#A9A9A9',
    'Kitchen Garden-Tunnel': '#DFFFDF',
    Pond: '#4682B4',
    'Social Garden': '#32CD32',
    'Social Garden-Compost': '#A9A9A9',
    'Social Garden-Pergola': '#D2B48C',
    'Social Garden-Fire': '#FFA500',
    'Social Garden-Path': '#C3B091',
    'Kitchen Garden-Path': '#C3B091',
    'Forest Garden-Path': '#C3B091',
    'Crop-Path': '#C3B091'
  };

  return {
    color: '#000000',
    weight: 1,
    fillColor: typeColors[feature.properties.Type] || '#808080',
    fillOpacity: 0.7,
  };
};

function App() {
  const [geoData, setGeoData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/Botildenborg.json')
      .then((res) => res.json())
      .then((data) => {
        const geojson = arcgisToGeoJSON.arcgisToGeoJSON(data);
        setGeoData(geojson);
      })
      .catch((err) => console.error("Error loading GeoJSON:", err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const id = feature.properties.ID || 'unknown';
      const name = feature.properties.Name || 'No Name';
      const type = feature.properties.Type || 'N/A';

      const popupContent = `
        <div>
          <b>${name}</b><br>
          Type: ${type}<br>
          ID: ${id}<br>
          <button id="edit-${id}">Edit</button>
        </div>
      `;

      layer.bindPopup(popupContent);

      layer.on('popupopen', () => {
        const btn = document.getElementById(`edit-${id}`);
        if (btn) {
          const route = infrastructureNames.includes(name)
            ? `/infra-edit/${id}`
            : `/edit/${id}`;
          btn.onclick = () => navigate(route, { state: { name: name } });
        }
      });

      layer.bindTooltip(
        id.toString(),
        { permanent: true, direction: 'center', className: 'leaflet-label' }
      ).openTooltip();
    }
  };

  // --- Right side button click handlers ---
  const handleButtonClick = (message) => {
    alert(message);
  };

  return (
    <div className="App">
      <h1 className="page-title">Botildenborg Garden Management</h1>

      {/* Right-side buttons */}
      <div className="side-buttons">
        <button onClick={() => handleButtonClick("This button will allow you to see this week's activities as a single table.")}>
          📅 Weekly Summary
        </button>
        <button onClick={() => handleButtonClick("This button will let you set a garden alert and notify other staff about emergencies.")}>
          🚨 Set Alerts
        </button>
        <button onClick={() => handleButtonClick("This button will let you create and edit the staff's weekly meeting agenda.")}>
          🧑‍🤝‍🧑 Team Schedule
        </button>
        <button onClick={() => handleButtonClick("This button will allow you to see some statistics, like the harvest or planting trends over time.")}>
          📊 Garden Analytics
        </button>
        <button onClick={() => handleButtonClick("This button will allow you to share garden photos with other staff.")}>
          📸 Upload Photos
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={18}
        minZoom={18}
        maxZoom={22}
        style={{ height: 'calc(100vh - 100px)', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && (
          <GeoJSON data={geoData} onEachFeature={onEachFeature} style={getStyle} />
        )}
        {geoData && <FitBounds geoData={geoData} />}
        {geoData && <ZoomListener />}
      </MapContainer>
    </div>
  );
}

export default App;
