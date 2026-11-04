import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Agar token nahi hai, toh Login page par bhejo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar token hai, toh jo page manga hai wo dikhao
  return children;
};

export default ProtectedRoute;