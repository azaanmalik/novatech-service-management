import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Agar login hi nahi hai -> Login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar login hai LEKIN Admin nahi hai -> Home page wapis
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Agar Admin hai -> Welcome Sir
  return children;
};

export default AdminRoute;