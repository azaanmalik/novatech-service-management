import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

import MyNavbar from './components/MyNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';

function App() {
  const location = useLocation(); // Ab ye line ERROR nahi degi

  return (
    // Yahan se <Router> hata diya gya hai (kyun ke wo ab main.jsx mein hai)
    <div className="d-flex flex-column min-vh-100">
      <MyNavbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div className="flex-grow-1">
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} /> 

            {/* USER ROUTES */}
            <Route path="/" element={<ProtectedRoute><PageTransition><Home /></PageTransition></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><PageTransition><Services /></PageTransition></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><PageTransition><Contact /></PageTransition></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><PageTransition><AdminBookings /></PageTransition></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><PageTransition><AdminUsers /></PageTransition></AdminRoute>} />

            {/* 404 ROUTE */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

export default App;