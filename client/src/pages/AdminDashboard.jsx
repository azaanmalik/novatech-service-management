import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardList, FaChartLine } from 'react-icons/fa';
import api from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, bookings: 0, pending: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Real implementation mein hum backend se count mangwa sakte hain
    // Abhi ke liye hum data fetch kar ke frontend pe count karenge
    const usersRes = await api.get('/api/admin/users');
    const bookingsRes = await api.get('/api/admin/enrollments');
    
    const pendingCount = bookingsRes.data.filter(b => b.status === 'Pending').length;

    setStats({
      users: usersRes.data.length,
      bookings: bookingsRes.data.length,
      pending: pendingCount
    });
  };

  return (
    <Container className="py-5 fade-in">
      <h2 className="fw-bold text-primary mb-4">Admin Overview 📊</h2>
      
      {/* Stats Cards */}
      <Row className="mb-5">
        <Col md={4}>
          <Card className="shadow-sm border-0 p-3 mb-3 bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>{stats.users}</h3>
                <p className="mb-0">Total Users</p>
              </div>
              <FaUsers size={40} opacity={0.5} />
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 p-3 mb-3 bg-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>{stats.bookings}</h3>
                <p className="mb-0">Total Bookings</p>
              </div>
              <FaClipboardList size={40} opacity={0.5} />
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-0 p-3 mb-3 bg-warning text-dark">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>{stats.pending}</h3>
                <p className="mb-0">Pending Requests</p>
              </div>
              <FaChartLine size={40} opacity={0.5} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <h4 className="fw-bold mb-3">Quick Actions</h4>
      <div className="d-flex gap-3">
        <Button as={Link} to="/admin/bookings" variant="dark" size="lg" className="rounded-pill px-4">
           Manage Bookings
        </Button>
        <Button as={Link} to="/admin/users" variant="outline-dark" size="lg" className="rounded-pill px-4">
           View All Users
        </Button>
      </div>
    </Container>
  );
};

export default AdminDashboard;