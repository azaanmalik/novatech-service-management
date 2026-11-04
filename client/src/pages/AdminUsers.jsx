import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Spinner } from 'react-bootstrap';
import api from '../api';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <PageTransition>
    <Container className="py-5">
       <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold text-primary">Registered Users</h2>
        <Button as={Link} to="/admin" variant="secondary">Back to Dashboard</Button>
      </div>

      <Card className="shadow border-0 rounded-4">
        <Card.Body>
          {loading ? (
             <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
          ) : (
            <Table hover responsive>
                <thead className="bg-dark text-white">
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? users.map((u) => (
                    <tr key={u._id}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge bg-info text-dark">{u.role}</span></td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" className="text-center">No users found (except admin)</td></tr>
                )}
                </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
    </PageTransition>
  );
};

export default AdminUsers;