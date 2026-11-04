import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import api from '../api';
import { toast } from 'react-toastify';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/contact', formData);
      toast.success("Message Sent Successfully!", { theme: "colored" });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message.", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 fade-in">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Get In Touch</h2>
        <p className="text-muted">Have a project in mind? Let's talk.</p>
      </div>

      <Row className="justify-content-center">
        {/* Left Column: Contact Info */}
        <Col md={5} className="mb-4">
          <Card className="h-100 border-0 shadow-sm p-4 bg-primary text-white" style={{ borderRadius: '15px' }}>
            <h3 className="mb-4">Contact Information</h3>
            <div className="d-flex align-items-center mb-4">
              <FaPhoneAlt size={20} className="me-3" />
              <div>
                <h6 className="mb-0">Phone</h6>
                <p className="mb-0">+92 300 1234567</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-4">
              <FaEnvelope size={20} className="me-3" />
              <div>
                <h6 className="mb-0">Email</h6>
                <p className="mb-0">info@novatech.com</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-4">
              <FaMapMarkerAlt size={20} className="me-3" />
              <div>
                <h6 className="mb-0">Address</h6>
                <p className="mb-0">Islamabad, Pakistan</p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Form */}
        <Col md={7}>
          <Card className="shadow border-0 p-4" style={{ borderRadius: '15px' }}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={5} name="message" placeholder="How can we help?" value={formData.message} onChange={handleChange} required />
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 rounded-pill" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;