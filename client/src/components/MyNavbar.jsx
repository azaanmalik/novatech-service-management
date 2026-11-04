import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaTimes } from 'react-icons/fa';
import api from '../api';

const MyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // --- SAFETY CHECK 1: User Data Parsing ---
  // Ye ensure karega ke agar local storage mein kachra hai to app crash na ho
  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("User Data Corrupt, Clearing...", error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Sirf tab chalo agar user aur user.id mojood ho
    if (user && user.id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, []); // Dependency array empty rakha hai taake loop na baney

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      const target = user.role === 'admin' ? 'admin-check' : user.id;
      const res = await api.get(`/api/notifications/${target}`);
      // Agar response array nahi hai to empty array use karo
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) { 
      // Error ko ignore karo taake user disturb na ho
    }
  };

  const markRead = async (id) => {
    try {
        await api.put(`/api/notifications/mark-read/${id}`);
        fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
        await api.delete(`/api/notifications/${id}`);
        fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.clear(); // Sab kuch saaf kar do
    navigate('/login');
    window.location.reload();
  };

  // --- SAFETY CHECK 2: Helper for Initials ---
  // Agar user ka naam missing ho to crash na ho
  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow sticky-top">
      <Container>
        <Navbar.Brand as={Link} to={user?.role === 'admin' ? "/admin" : "/"} className="fw-bold fs-4">
          Nova<span className="text-primary">Tech</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* VIEW 1: GUEST (Koi Login Nahi) */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
                <Button as={Link} to="/login" variant="outline-light" className="ms-2 rounded-pill px-3">Login</Button>
                <Button as={Link} to="/signup" variant="primary" className="ms-2 rounded-pill px-3">Signup</Button>
              </>
            )}

            {/* VIEW 2: NORMAL USER */}
            {user && user.role === 'user' && (
              <>
                <Nav.Link as={Link} to="/" className={location.pathname === '/' ? 'active fw-bold' : ''}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/services" className="mx-2">Services</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="mx-2">Contact</Nav.Link>
                <Nav.Link as={Link} to="/about" className="mx-2">About</Nav.Link>
              </>
            )}

            {/* VIEW 3: ADMIN */}
            {user && user.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active fw-bold text-warning' : 'text-light'}>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/bookings" className="mx-2">Manage Bookings</Nav.Link>
                <Nav.Link as={Link} to="/admin/users" className="mx-2">Manage Users</Nav.Link>
              </>
            )}

            {/* LOGGED IN USER ITEMS (Bell & Profile) */}
            {user && (
              <>
                {/* Notification Bell */}
                <Dropdown align="end" className="mx-3">
                  <Dropdown.Toggle variant="dark" className="position-relative border-0 p-0 show-caret-off">
                    <FaBell size={20} className={unreadCount > 0 ? "text-warning" : "text-light"} />
                    {unreadCount > 0 && (
                      <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle rounded-circle" style={{fontSize: '0.6rem'}}>
                        {unreadCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-lg border-0" style={{ minWidth: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                    <Dropdown.Header className="fw-bold border-bottom">Notifications</Dropdown.Header>
                    {notifications.length === 0 ? (
                      <div className="p-3 text-center text-muted small">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <Dropdown.Item 
                            key={notif._id} 
                            onClick={() => markRead(notif._id)}
                            className="d-flex justify-content-between align-items-start py-2 border-bottom"
                            style={{ opacity: notif.read ? 0.6 : 1 }}
                        >
                          <div style={{ maxWidth: '85%', whiteSpace: 'normal' }}>
                            <div className={`small fw-bold ${notif.type === 'success' ? 'text-success' : notif.type === 'error' ? 'text-danger' : 'text-primary'}`}>
                                {notif.type.toUpperCase()}
                            </div>
                            <span className="small text-dark">{notif.message}</span>
                          </div>
                          <Button variant="link" size="sm" className="p-0 text-danger" onClick={(e) => deleteNotification(e, notif._id)}>
                            <FaTimes />
                          </Button>
                        </Dropdown.Item>
                      ))
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {/* User Profile Dropdown */}
                <div className="d-flex align-items-center border-start ps-3">
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="transparent" className="d-flex align-items-center border-0 p-0 text-light show-caret-off">
                            <div className="text-end lh-1 me-2 d-none d-lg-block">
                                <span className="d-block fw-bold small">{user.name || "User"}</span>
                                <span className="d-block text-white-50" style={{fontSize: '10px'}}>
                                    {user.role === 'admin' ? 'Administrator' : 'User'}
                                </span>
                            </div>
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                                 style={{ width: '35px', height: '35px' }}>
                                {getUserInitial()}
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow border-0 mt-2">
                            <Dropdown.Item as={Link} to="/profile">Settings & Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout} className="text-danger">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;