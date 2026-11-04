import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icons Import

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Strong Password Regex
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!", { theme: "colored" });
    }

    if (!passwordRegex.test(formData.password)) {
      return toast.warning("Password must be 6+ chars, with 1 number & 1 special char (!@#$)", { theme: "colored" });
    }

    setLoading(true);
    try {
      // Backend ko sirf zaroori data bhejo (confirmPassword mat bhejo)
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      await api.post('/api/register', dataToSend);
      toast.success("Registration Successful! Please Login.", { theme: "colored" });
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration Failed", { theme: "colored" });
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="p-4 shadow-lg" style={{ width: "450px", borderRadius: "15px" }}>
        <h2 className="text-center text-primary mb-4 fw-bold">Create Account</h2>
        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
          </Form.Group>

          {/* Password Field with Eye Icon */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Strong Password" 
                onChange={handleChange} 
                required 
              />
              <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
            <Form.Text className="text-muted" style={{ fontSize: "12px" }}>
              Must contain 1 number & 1 special char.
            </Form.Text>
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup>
              <Form.Control 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Re-enter Password" 
                onChange={handleChange} 
                required 
              />
              <InputGroup.Text onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mt-2 rounded-pill fw-bold" disabled={loading}>
             {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </Button>
        </Form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="fw-bold">Login</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Signup;