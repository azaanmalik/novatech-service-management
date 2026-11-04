import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaLaptopCode, FaMobileAlt, FaSearchDollar, FaShieldAlt, FaPaintBrush, FaCloud } from 'react-icons/fa';
import api from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const servicesData = [
    { id: 1, title: "Web Development", desc: "MERN Stack websites.", icon: <FaLaptopCode /> },
    { id: 2, title: "App Development", desc: "React Native Apps.", icon: <FaMobileAlt /> },
    { id: 3, title: "UI/UX Design", desc: "Modern Designs.", icon: <FaPaintBrush /> },
    { id: 4, title: "Digital Marketing", desc: "SEO & Growth.", icon: <FaSearchDollar /> },
    { id: 5, title: "Cyber Security", desc: "Secure Audits.", icon: <FaShieldAlt /> },
    { id: 6, title: "Cloud Solutions", desc: "AWS & Azure.", icon: <FaCloud /> }
];

const Services = () => {
  const navigate = useNavigate();

  const handleBook = async (serviceName) => {
    // Local Storage se fresh data lo
    const userString = localStorage.getItem('user');
    if (!userString) {
      toast.error("Please Login to Book!", { theme: "colored" });
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);

    try {
      // Backend ko data bhejo
      await api.post('/api/enroll', {
        userId: user.id,   // Ye ID backend se match honi chahiye
        userName: user.name,
        serviceName: serviceName
      });
      toast.success(`${serviceName} Request Sent!`, { theme: "colored" });
    } catch (error) {
      console.error(error);
      toast.error("Booking Failed. Try re-login.", { theme: "colored" });
    }
  };

  return (
    <PageTransition>
    <Container className="py-5">
      <h2 className="text-center fw-bold display-5 text-primary mb-5">Our Expertise</h2>
      <Row>
        {servicesData.map((service) => (
          <Col md={4} sm={6} xs={12} key={service.id} className="mb-4">
            <Card className="h-100 p-4 service-card text-center border-0 shadow-sm">
              <div className="d-flex justify-content-center">
                <div className="icon-box display-4 text-primary mb-3">{service.icon}</div>
              </div>
              <Card.Body>
                <Card.Title className="fw-bold">{service.title}</Card.Title>
                <Card.Text className="text-muted small">{service.desc}</Card.Text>
                <Button 
                    variant="primary" 
                    className="mt-3 rounded-pill px-4 w-100"
                    onClick={() => handleBook(service.title)}
                >
                    Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </PageTransition>
  );
};

export default Services;