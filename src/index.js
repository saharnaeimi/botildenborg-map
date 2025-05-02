// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import EditPage from './EditPage';

const basename = process.env.PUBLIC_URL;  
// On GitHub Pages this will be "/botildenborg-map"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="edit/:id" element={<EditPage />} />
      {/* optional catch‑all: */}
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
