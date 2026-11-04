import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Card } from 'react-bootstrap';
import api from '../api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminBookings = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/admin/enrollments');
      setEnrollments(res.data);
    } catch (error) { console.error("Error"); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/update-status/${id}`, { status });
      toast.success(`Request ${status}`, { theme: "colored" });
      fetchData();
    } catch (error) { toast.error("Update Failed"); }
  };

  return (
    <Container className="py-5 fade-in">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold text-primary">Manage Bookings</h2>
        <Button as={Link} to="/admin" variant="secondary">Back to Dashboard</Button>
      </div>
      
      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          <Table hover responsive className="align-middle">
            <thead className="bg-dark text-white">
              <tr>
                <th>User Name</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((item) => (
                <tr key={item._id}>
                  <td className="fw-bold">{item.userName}</td>
                  <td>{item.serviceName}</td>
                  <td>
                    <Badge bg={item.status === 'Approved' ? 'success' : item.status === 'Rejected' ? 'danger' : 'warning'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    {item.status === 'Pending' && (
                      <>
                        <Button variant="success" size="sm" className="me-2" onClick={() => updateStatus(item._id, 'Approved')}>Approve</Button>
                        <Button variant="danger" size="sm" onClick={() => updateStatus(item._id, 'Rejected')}>Reject</Button>
                      </>
                    )}
                    {item.status !== 'Pending' && <span className="text-muted small">Completed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBookings;