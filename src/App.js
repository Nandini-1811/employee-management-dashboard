import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import ListPage from './pages/ListPage';
import DetailsPage from './pages/DetailsPage';
import PhotoResultPage from './pages/PhotoResultPage';
import BarChartPage from './pages/BarChartPage';

// Simple auth guard
function PrivateRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem('jotish_auth') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/list" element={<PrivateRoute><ListPage /></PrivateRoute>} />
        <Route path="/details/:id" element={<PrivateRoute><DetailsPage /></PrivateRoute>} />
        <Route path="/photo-result" element={<PrivateRoute><PhotoResultPage /></PrivateRoute>} />
        <Route path="/charts" element={<PrivateRoute><BarChartPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
