# NovaTech — Service Management Platform

![MERN](https://img.shields.io/badge/Stack-MERN-0F766E) ![License: MIT](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Portfolio_Project-64748b)

Full-stack web engineering project for managing digital service requests, bookings, accounts, notifications and administration.

## Features

- React/Vite responsive frontend with Bootstrap and animated page transitions
- Account registration and JWT-based login
- User dashboard, service requests, booking status and charts
- Admin dashboard for users, bookings, approvals and notifications
- MongoDB persistence with Mongoose

## Stack

**Frontend:** React 19, Vite, React Router, Bootstrap, Axios, Framer Motion, Recharts. **Backend:** Node.js, Express 5, Mongoose, MongoDB, bcryptjs, JWT.

## Local setup

1. Install Node.js and start a MongoDB server.
2. Copy `server/.env.example` to `server/.env` and configure values. Set `ADMIN_EMAIL` to the intended administrator's email. Register that account normally, then run `cd server && npm run promote-admin` once locally to grant admin access. Public registration never grants admin privileges.
3. Run `cd server && npm ci && npm start`.
4. In another terminal copy `client/.env.example` to `client/.env`, then run `cd client && npm ci && npm run dev`.
5. Open the local Vite URL shown in the terminal.

Never commit `.env` files. Administrator promotion is a separate local database operation; never expose it as a public API. The contact endpoint currently returns HTTP 501 because no email delivery provider is configured.

## Structure

```text
client/    React UI, routing and dashboards
server/    Express API, auth, MongoDB models
.github/   automated validation
```

## Security

JWT secret is loaded from the environment, and protected API routes require valid bearer tokens and role/ownership checks. Review [SECURITY.md](SECURITY.md) before deploying. The original source archive contained a local environment file; credentials in that file should be rotated if exposed elsewhere.

## License

[MIT](LICENSE) © 2026 Muhammad Azaan Malik. Third-party dependencies and assets retain their own licenses.
