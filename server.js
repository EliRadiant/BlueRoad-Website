// server.js
// Entry point. Serves the static frontend from /public and the auth API under /api/auth.
// Run with: npm start  (or npm run dev for auto-restart while editing)

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-this-before-deploying',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      // secure: true  // uncomment once you're serving over HTTPS in production
    },
  })
);

app.use('/api/auth', authRoutes);

// Everything in /public (html, css, js, images) is served as static files.
// Nothing outside /public — server.js, routes/, db/, data/ — is reachable from the browser.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Blueroad running at http://localhost:${PORT}`);
});
