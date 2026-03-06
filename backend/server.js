'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://yourdomain.com'
    : ['http://localhost', 'http://localhost:3000', 'http://localhost:5500', 'file://'],
  credentials: true
}));
app.use(express.json());

// ═══════════════════════════════════════════════════════════
// IN-MEMORY DATA STORE (replace with DB later)
// ═══════════════════════════════════════════════════════════

const users = {}; // username -> {email, password_hash, created}
const userLogbooks = {}; // username -> logbook data
const userCalculations = {}; // username -> calculation history

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Missing email, password, or username' });
    }

    if (users[username]) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const password_hash = await bcryptjs.hash(password, 10);

    // Store user
    users[username] = {
      email,
      password_hash,
      created: new Date().toISOString()
    };

    // Initialize user data
    userLogbooks[username] = [];
    userCalculations[username] = [];

    // Create JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { username, email },
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user by email
    const username = Object.keys(users).find(u => users[u].email === email);
    if (!username) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, users[username].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { username, email },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/refresh', (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ username: decoded.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = users[req.user.username];
  res.json({
    username: req.user.username,
    email: user.email,
    created: user.created
  });
});

// ═══════════════════════════════════════════════════════════
// SYNC ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.post('/api/sync/logbook', verifyToken, (req, res) => {
  try {
    const { logbook } = req.body;
    userLogbooks[req.user.username] = logbook;

    res.json({
      message: 'Logbook saved',
      synced: true
    });
  } catch (err) {
    console.error('Logbook save error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.get('/api/sync/logbook', verifyToken, (req, res) => {
  try {
    const logbook = userLogbooks[req.user.username] || [];
    res.json({ logbook });
  } catch (err) {
    console.error('Logbook fetch error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

app.post('/api/sync/calculations', verifyToken, (req, res) => {
  try {
    const { calculations } = req.body;
    userCalculations[req.user.username] = calculations;

    res.json({
      message: 'Calculations saved',
      synced: true
    });
  } catch (err) {
    console.error('Calculations save error:', err);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.get('/api/sync/calculations', verifyToken, (req, res) => {
  try {
    const calculations = userCalculations[req.user.username] || [];
    res.json({ calculations });
  } catch (err) {
    console.error('Calculations fetch error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MuscleOS Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
