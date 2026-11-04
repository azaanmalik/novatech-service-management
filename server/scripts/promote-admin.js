// Run locally after registering the intended administrator: npm run promote-admin
// Requires MONGO_URI and ADMIN_EMAIL in server/.env. Never expose this script as an HTTP route.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
(async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!email || !process.env.MONGO_URI) throw new Error('Set ADMIN_EMAIL and MONGO_URI in .env');
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email });
  if (!user) throw new Error('Register the intended administrator account first');
  user.role = 'admin';
  await user.save();
  console.log('Administrator role granted to configured ADMIN_EMAIL');
})().catch(err => { console.error(err.message); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
