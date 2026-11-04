import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Badge, Spinner, Row, Col, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaClipboardList, FaCheckCircle, FaHourglassHalf, FaChartPie } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Chart Data States
  const [statusData, setStatusData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // --- CLASH FIX: Redirect Admin IMMEDIATELY ---
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // --- Data Fetching ---
  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchEnrollments();
    }
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/my-enrollments/${user.id}`);
      setEnrollments(res.data);
      processChartData(res.data); // Data ko Graph k liye ready karo
    } catch (error) { console.error("Error fetching data"); } 
    finally { setLoading(false); }
  };

  // --- Helper: Convert Data for Graphs ---
  const processChartData = (data) => {
    // 1. Prepare Pie Chart Data (Status)
    const pending = data.filter(d => d.status === 'Pending').length;
    const approved = data.filter(d => d.status === 'Approved').length;
    const rejected = data.filter(d => d.status === 'Rejected').length;
    
    setStatusData([
      { name: 'Approved', value: approved, color: '#198754' }, // Green
      { name: 'Pending', value: pending, color: '#ffc107' },   // Yellow
      { name: 'Rejected', value: rejected, color: '#dc3545' }  // Red
    ]);

    // 2. Prepare Bar Chart Data (Services Count)
    // Ye check karega k user ne konsi service kitni bar li h
    const serviceCounts = {};
    data.forEach(item => {
        serviceCounts[item.serviceName] = (serviceCounts[item.serviceName] || 0) + 1;
    });
    
    const barData = Object.keys(serviceCounts).map(key => ({
        name: key.split(' ')[0], // Sirf pehla lafz (e.g., Web instead of Web Development) taake graph neat lage
        bookings: serviceCounts[key]
    }));
    setServiceData(barData);
  };

  // --- Actions ---
  const handleCancelClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/enrollments/${selectedId}`);
      toast.info("Booking Cancelled", { theme: "colored" });
      setShowModal(false);
      fetchEnrollments();
    } catch (error) { toast.error("Failed to cancel"); }
  };

  // --- RENDER LOGIC ---

  // 1. Agar Admin hai to KUCH MAT DIKHAO (Jab tak redirect na hojaye)
  if (user && user.role === 'admin') return null;

  // 2. GUEST VIEW (Landing Page)
  if (!user) {
    return (
      <div className="fade-in">
        <div className="bg-dark text-white text-center py-5" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Container>
            <h1 className="display-3 fw-bold">Innovate with <span className="text-primary">NovaTech</span></h1>
            <p className="lead mb-4">Your Partner in Digital Transformation.</p>
            <Button as={Link} to="/signup" variant="primary" size="lg" className="rounded-pill px-4 mx-2">Get Started</Button>
          </Container>
        </div>
      </div>
    );
  }

  // 3. USER DASHBOARD VIEW
  return (
    <Container className="py-5 fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold">User Dashboard 🚀</h2>
          <p className="text-muted">Welcome back, <span className="text-primary fw-bold">{user.name}</span></p>
        </div>
        <Button as={Link} to="/services" variant="primary" className="rounded-pill shadow px-4">+ Book New Service</Button>
      </div>

      {/* --- STATS CARDS --- */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderLeft: '5px solid #0d6efd' }}>
            <div className="d-flex align-items-center">
                <div className="bg-light p-3 rounded-circle text-primary me-3"><FaClipboardList size={24}/></div>
                <div>
                    <h3 className="mb-0 fw-bold">{enrollments.length}</h3>
                    <span className="text-muted small">Total Requests</span>
                </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderLeft: '5px solid #ffc107' }}>
            <div className="d-flex align-items-center">
                <div className="bg-light p-3 rounded-circle text-warning me-3"><FaHourglassHalf size={24}/></div>
                <div>
                    <h3 className="mb-0 fw-bold">{statusData.find(d => d.name === 'Pending')?.value || 0}</h3>
                    <span className="text-muted small">Pending</span>
                </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm p-3 mb-3" style={{ borderLeft: '5px solid #198754' }}>
            <div className="d-flex align-items-center">
                <div className="bg-light p-3 rounded-circle text-success me-3"><FaCheckCircle size={24}/></div>
                <div>
                    <h3 className="mb-0 fw-bold">{statusData.find(d => d.name === 'Approved')?.value || 0}</h3>
                    <span className="text-muted small">Approved</span>
                </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* --- CHARTS SECTION (Only show if data exists) --- */}
      {enrollments.length > 0 && (
        <Row className="mb-5">
            {/* Pie Chart */}
            <Col md={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100 p-3">
                    <Card.Title className="fw-bold text-muted mb-4"><FaChartPie className="me-2"/> Project Status</Card.Title>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Col>

            {/* Bar Chart */}
            <Col md={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100 p-3">
                    <Card.Title className="fw-bold text-muted mb-4">Services Requested</Card.Title>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={serviceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="bookings" fill="#0d6efd" barSize={40} radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Col>
        </Row>
      )}

      {/* --- RECENT ACTIVITY TABLE --- */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h5 className="fw-bold mb-3 text-secondary">Recent Activity</h5>
          {loading ? <Spinner animation="border" className="d-block mx-auto text-primary" /> : (
            <Table hover responsive className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="text-uppercase small fw-bold text-muted">Service Name</th>
                  <th className="text-uppercase small fw-bold text-muted">Date</th>
                  <th className="text-uppercase small fw-bold text-muted">Status</th>
                  <th className="text-uppercase small fw-bold text-muted text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? enrollments.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-bold text-dark">{item.serviceName}</td>
                    <td className="text-muted">{new Date(item.date).toLocaleDateString()}</td>
                    <td>
                        <Badge bg={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'} className="px-3 py-2 rounded-pill">
                            {item.status}
                        </Badge>
                    </td>
                    <td className="text-end">
                        {item.status === 'Pending' ? (
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleCancelClick(item._id)}>
                                Cancel
                            </Button>
                        ) : (
                            <span className="text-muted small">Closed</span>
                        )}
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan="4" className="text-center py-5 text-muted">No bookings yet. Start by booking a service!</td></tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold text-danger"><FaExclamationTriangle className="me-2" /> Cancel Request?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="lead mb-0">Are you sure you want to cancel this booking?</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center pb-4">
          <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill px-4 me-2">Keep it</Button>
          <Button variant="danger" onClick={confirmDelete} className="rounded-pill px-4">Yes, Cancel</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Home;