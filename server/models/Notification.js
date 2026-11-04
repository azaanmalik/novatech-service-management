const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Jisko notification dikhana hai (Admin or Specific User)
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, // 'success', 'error', 'info'
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);