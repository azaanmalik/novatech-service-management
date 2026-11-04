import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';
import PageTransition from '../components/PageTransition'; // Animation Wrapper

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({ name: user.name, password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put(`/api/user/update/${user.id}`, formData);
      
      // Update Local Storage with new Name
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success("Profile Updated Successfully!", { theme: "colored" });
      setTimeout(() => window.location.reload(), 1500); // Page Refresh taake naam update ho
    } catch (error) {
      toast.error("Update Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container className="py-5 d-flex justify-content-center">
        <Card className="shadow-lg border-0 p-4" style={{ maxWidth: '600px', width: '100%', borderRadius: '15px' }}>
            <h3 className="fw-bold text-primary mb-4 text-center">Account Settings ⚙️</h3>
            
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>Email Address (Cannot be changed)</Form.Label>
                            <Form.Control type="email" value={user.email} disabled className="bg-light" />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>New Password (Leave blank to keep current)</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter new password"
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 rounded-pill" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Save Changes"}
                </Button>
            </Form>
        </Card>
      </Container>
    </PageTransition>
  );
};

export default Profile;