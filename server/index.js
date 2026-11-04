const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Contact = require('./models/Contact');
const Enrollment = require('./models/Enrollment');
const Notification = require('./models/Notification');

const app = express();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
}
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => { console.error('MongoDB connection failed:', err.message); process.exitCode = 1; });

const createNotification = async (userId, message, type) => {
    try {
        const newNotif = new Notification({ userId, message, type });
        await newNotif.save();
    } catch (error) { console.error("Notif Error", error); }
};


const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select('_id role name email');
        if (!user) return res.status(401).json({ error: 'Invalid account' });
        req.authUser = user;
        next();
    } catch (_) { res.status(401).json({ error: 'Invalid or expired token' }); }
};
const adminOnly = (req, res, next) => req.authUser.role === 'admin'
    ? next() : res.status(403).json({ error: 'Admin access required' });
const validId = (id) => mongoose.isValidObjectId(id);

// --- AUTH ROUTES ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
            typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            typeof password !== 'string' || password.length < 8 || password.length > 128)
            return res.status(400).json({ error: 'Provide valid name, email and password (8+ characters)' });
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) return res.status(400).json({ error: "Email exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'user'; // Admin roles are assigned out-of-band using scripts/promote-admin.js

        const newUser = new User({ name: name.trim(), email: normalizedEmail, password: hashedPassword, role });
        await newUser.save();
        if(role === 'user') await createNotification('admin', `New User: ${name}`, 'info');

        res.status(201).json({ message: "Registered!" });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: String(email || '').trim().toLowerCase() });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Frontend ko 'id' bhejna zaroori hai
        res.json({ 
            message: "Login Success", token, 
            user: { id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

// --- ADMIN ROUTES (Fixing User Data Issue) ---
app.get('/api/admin/users', authenticate, adminOnly, async (req, res) => {
    try {
        // Sirf 'user' role walo ko dikhao. Password mat bhejo.
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) { res.status(500).json({ error: "Error fetching users" }); }
});

app.get('/api/admin/enrollments', authenticate, adminOnly, async (req, res) => {
    try {
        const enrollments = await Enrollment.find().sort({ date: -1 });
        res.json(enrollments);
    } catch (error) { res.status(500).json({ error: "Error fetching enrollments" }); }
});

app.put('/api/admin/update-status/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status))
            return res.status(400).json({ error: 'Invalid status' });
        const booking = validId(req.params.id) ? await Enrollment.findByIdAndUpdate(req.params.id, { status }) : null;
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if(booking) {
            const type = status === 'Approved' ? 'success' : 'error';
            await createNotification(booking.userId, `Request ${status}: ${booking.serviceName}`, type);
        }
        res.json({ message: "Status Updated" });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

// --- USER ROUTES (Fixing Booking & Loading Issue) ---
app.post('/api/enroll', authenticate, async (req, res) => {
    try {
        
        const { userId, serviceName } = req.body;
        const userName = req.authUser.name;
        if (!validId(userId) || String(req.authUser._id) !== String(userId))
            return res.status(403).json({ error: 'Cannot create bookings for another account' });
        if (typeof serviceName !== 'string' || !serviceName.trim())
            return res.status(400).json({ error: 'Service required' });

        const newEnrollment = new Enrollment({ userId, userName, serviceName });
        await newEnrollment.save();
        await createNotification('admin', `New Booking: ${userName}`, 'info');
        
        res.status(201).json({ message: "Booked!" });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ error: "Booking Failed" }); 
    }
});

app.get('/api/my-enrollments/:userId', authenticate, async (req, res) => {
    try {
        if (req.authUser.role !== 'admin' && String(req.authUser._id) !== req.params.userId)
            return res.status(403).json({ error: 'Access denied' });
        const enrollments = await Enrollment.find({ userId: req.params.userId }).sort({ date: -1 });
        res.json(enrollments);
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

app.delete('/api/enrollments/:id', authenticate, async (req, res) => {
    try {
        const booking = validId(req.params.id) ? await Enrollment.findById(req.params.id) : null;
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (req.authUser.role !== 'admin' && String(booking.userId) !== String(req.authUser._id))
            return res.status(403).json({ error: 'Access denied' });
        await booking.deleteOne();
        res.json({ message: "Deleted" });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

// --- NOTIFICATION ROUTES (Fixing Delete Issue) ---
app.get('/api/notifications/:userId', authenticate, async (req, res) => {
    try {
        const target = req.params.userId === 'admin-check' ? 'admin' : req.params.userId;
        if (target === 'admin' ? req.authUser.role !== 'admin' : String(req.authUser._id) !== target)
            return res.status(403).json({ error: 'Access denied' });
        const notifs = await Notification.find({ userId: target }).sort({ date: -1 });
        res.json(notifs);
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

app.put('/api/notifications/mark-read/:id', authenticate, async (req, res) => {
    try {
        const notification = validId(req.params.id) ? await Notification.findById(req.params.id) : null;
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        if (notification.userId === 'admin' ? req.authUser.role !== 'admin' : notification.userId !== String(req.authUser._id))
            return res.status(403).json({ error: 'Access denied' });
        notification.read = true;
        await notification.save();
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

// Ye route zaroori hai delete k liye
app.delete('/api/notifications/:id', authenticate, async (req, res) => {
    try {
        const notification = validId(req.params.id) ? await Notification.findById(req.params.id) : null;
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        if (notification.userId === 'admin' ? req.authUser.role !== 'admin' : notification.userId !== String(req.authUser._id))
            return res.status(403).json({ error: 'Access denied' });
        await notification.deleteOne();
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Error" }); }
});

app.put('/api/user/update/:id', authenticate, async (req, res) => {
    try {
        if (String(req.authUser._id) !== req.params.id)
            return res.status(403).json({ error: 'Access denied' });
        const { name, password } = req.body;
        if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
            (password && (typeof password !== 'string' || password.length < 8 || password.length > 128)))
            return res.status(400).json({ error: 'Invalid profile details' });
        const updateData = { name: name.trim() };
        if (password) updateData.password = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ success: true, user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role } });
    } catch (error) { res.status(500).json({ error: "Update Failed" }); }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body || {};
        if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
            typeof email !== 'string' || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || email.length > 254 ||
            typeof message !== 'string' || message.trim().length < 10 || message.length > 5000)
            return res.status(400).json({ error: 'Please provide valid contact details and a message of at least 10 characters' });
        await Contact.create({ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() });
        await createNotification('admin', 'New contact inquiry received', 'info');
        return res.status(201).json({ message: 'Inquiry received and saved' });
    } catch (error) { return res.status(500).json({ error: 'Unable to save inquiry' }); }
});

app.get('/api/admin/contacts', authenticate, adminOnly, async (req, res) => {
    try { return res.json(await Contact.find().sort({ date: -1 }).limit(100)); }
    catch (_) { return res.status(500).json({ error: 'Unable to load inquiries' }); }
});

app.get('/api/health', (req, res) => res.json({ status: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable' }));

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));