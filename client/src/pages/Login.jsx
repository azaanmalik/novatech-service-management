import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // Eye Icon logic
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/login', formData);
      
      // 1. Token aur User Data Save karo
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success("Login Successful!", { theme: "colored" });
      
      // 2. SMART REDIRECT LOGIC
      // Thora wait karo taake user Toast message parh sake
      setTimeout(() => {
        if (res.data.user.role === 'admin') {
          navigate('/admin'); // Admin Panel
        } else {
          navigate('/');      // User Dashboard
        }
        window.location.reload(); // Navbar update karne ke liye refresh
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid Credentials", { theme: "colored" });
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center fade-in" style={{ minHeight: "80vh" }}>
      <Card className="p-4 shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>
        <h2 className="text-center text-primary mb-4 fw-bold">Login</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="Enter email" 
              onChange={handleChange} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
              <InputGroup.Text 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mt-2 rounded-pill fw-bold" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Processing...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
        
        <p className="text-center mt-3 text-muted">
          Don't have an account? <Link to="/signup" className="fw-bold text-decoration-none">Sign Up</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;