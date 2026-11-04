import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="fade-in">
      {/* Section 1: Hero Area */}
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="fw-bold display-4 mb-4">We Build <span className="text-primary">Future Tech</span></h1>
            <p className="lead text-muted mb-4">
              NovaTech is a global digital agency helping businesses transform with code, creativity, and strategy. 
              We started in 2024 with a mission to simplify technology for everyone.
            </p>
            <p className="text-muted">
              Whether it is a startup looking for an App or an Enterprise needing Cloud Solutions, 
              we have the experts to make it happen.
            </p>
            <Button as={Link} to="/contact" variant="primary" size="lg" className="rounded-pill px-4 mt-3">
              Work With Us
            </Button>
          </Col>
          <Col md={6} className="text-center">
            {/* Placeholder Image used for Professional Look */}
            <Image 
              src="https://placehold.co/600x400/0d6efd/ffffff?text=Our+Team+Working" 
              fluid 
              className="rounded-4 shadow-lg hover-effect" 
              alt="About Us"
            />
          </Col>
        </Row>
      </Container>

      {/* Section 2: Why Choose Us (Stats) */}
      <div className="bg-dark text-white py-5 mt-5">
        <Container>
          <Row className="text-center">
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <h2 className="fw-bold text-primary display-5">50+</h2>
              <p>Projects Completed</p>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <h2 className="fw-bold text-primary display-5">20+</h2>
              <p>Expert Developers</p>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <h2 className="fw-bold text-primary display-5">100%</h2>
              <p>Client Satisfaction</p>
            </Col>
            <Col md={3} xs={6} className="mb-4 mb-md-0">
              <h2 className="fw-bold text-primary display-5">24/7</h2>
              <p>Support System</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;