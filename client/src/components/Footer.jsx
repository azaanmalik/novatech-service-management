import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row>
          {/* Brand Section */}
          <Col md={4} className="mb-4">
            <h3 className="fw-bold">Nova<span className="text-primary">Tech</span></h3>
            <p className="text-muted small mt-3">
              We provide professional IT solutions including Web Development, App Development, and Digital Marketing.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3 text-primary">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none hover-primary">Home</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none hover-primary">About Us</Link></li>
              <li><Link to="/services" className="text-light text-decoration-none hover-primary">Services</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none hover-primary">Contact</Link></li>
            </ul>
          </Col>

          {/* Social Icons */}
          <Col md={4}>
            <h5 className="fw-bold mb-3 text-primary">Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-light fs-5"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-light fs-5"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-light fs-5"><FaLinkedinIn /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-light fs-5"><FaInstagram /></a>
            </div>
            <p className="text-muted small mt-3">
              &copy; 2024 NovaTech. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;