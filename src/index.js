// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import EditPage from './EditPage';
import InfraEditPage from './InfraEditPage'; // ✅ import the new component

const basename = process.env.PUBLIC_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="edit/:id" element={<EditPage />} />
      <Route path="infra-edit/:id" element={<InfraEditPage />} /> {/* ✅ new route */}
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
