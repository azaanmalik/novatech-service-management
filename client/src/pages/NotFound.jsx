import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaGhost } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';

const NotFound = () => {
  return (
    <PageTransition>
        <Container className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <FaGhost size={80} className="text-muted mb-4" />
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="mb-4 text-muted">Oops! Page not found.</h4>
        <p className="mb-5" style={{ maxWidth: '400px' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button as={Link} to="/" variant="dark" size="lg" className="rounded-pill px-5">
            Back to Home
        </Button>
        </Container>
    </PageTransition>
  );
};

export default NotFound;