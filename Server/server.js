const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Sample In-Memory Database (Mock)
const mockDB = [];
// Sample in-memory token store for simplicity (mock)
let mockTokens = ['validToken123']; // Array to hold valid tokens

// GET /ping
app.get('/ping', (req, res) => {
  console.log(`[${new Date().toISOString()}] /ping endpoint hit`);
  res.send('Pong');
});

// POST /get_mfa_key
app.post('/get_mfa_key', (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.error(`[${new Date().toISOString()}] Missing email in /get_mfa_key`);
    return res.status(400).send({ message: 'Email is required' });
  }

  console.log(`[${new Date().toISOString()}] /get_mfa_key called with email: ${email}`);
  res.status(200).send({ message: '123456', email });
});

// POST /register
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    console.error(`[${new Date().toISOString()}] Missing fields in /register`);
    return res.status(400).send({ message: 'All fields required!' });
  }

  console.log(`[${new Date().toISOString()}] /register called with data: 
    username: ${username},
    email: ${email},
    password: ${password}`);
  
  mockDB.push({ username, password, email });
  console.log(`[${new Date().toISOString()}] User saved to mockDB:`, { username, email });
  res.status(200).send({ message: 'User saved to DB!', savedUser: { username, email } });
});

// POST /confirm_code
app.post('/confirm_code', (req, res) => {
  const { code } = req.body;

  if (!code) {
    console.error(`[${new Date().toISOString()}] Missing code in /confirm_code`);
    return res.status(400).send({ message: 'Code is required' });
  }

  console.log(`[${new Date().toISOString()}] /confirm_code called with code: ${code}`);

  if (code === '1111') {
    console.log(`[${new Date().toISOString()}] Correct code provided`);
    res.status(200).send({
      token: code
    });
  } else {
    console.error(`[${new Date().toISOString()}] Wrong code provided`);
    res.status(400).send({
      message: "Wrong code, try again!"
    });
  }
});



// POST /refresh_token
app.post('/refresh_token', (req, res) => {
  const { token } = req.body;

  // Check if the token is provided
  if (!token) {
    console.error('No token provided');
    return res.status(400).send({ message: 'Token is required' });
  }

  // Validate the token
  if (!mockTokens.includes(token)) {
    console.error('Invalid token');
    return res.status(401).send({ message: 'Invalid token' });
  }

  // Generate a new token (mock implementation)
  const newToken = `newToken-${Date.now()}`;
  mockTokens = mockTokens.filter((t) => t !== token); // Remove the old token
  mockTokens.push(newToken); // Add the new token

  console.log(`Token refreshed successfully: ${newToken}`);
  res.status(200).send({ token: newToken });
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server is running on http://localhost:${PORT}`);
});
