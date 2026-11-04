# Security Policy

Never commit `.env`, MongoDB credentials, or JWT signing secrets. Configure `JWT_SECRET` (32+ random characters), `MONGO_URI`, `ADMIN_EMAIL`, and `CLIENT_ORIGIN` on the server. Frontend routes do not replace server-side authorization. Rotate any secrets previously exposed in an archive or commit. Report vulnerabilities privately to the repository owner rather than opening a public issue. This student project has not undergone a production security audit.
