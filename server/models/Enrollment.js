const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    serviceName: String,
    status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);