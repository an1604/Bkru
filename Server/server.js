const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
const PORT = 3000;

const users = [
  new User('user@example.com', 'password123', 'Admin')
];
const SECRET_KEY = 'your-secret-key';
// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

//POST login (Mock!)
app.post('/login', (req, res) => {
  console.log('Inside /login route!');
  
  const { email } = req.body;
  const user = users.find(user => user.email === email);
  
  if (!user) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: '1h' // Token expires in 1 hour
  });

  mockTokens.push(token);
  res.status(200).send({
    token: token
  });
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
  
  users.push(new User(username, email, password ));
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


// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server is running on http://localhost:${PORT}`);
});
