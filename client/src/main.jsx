import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Router yahan import hoga
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Router ko sab se bahar lagana zaroori hai */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);