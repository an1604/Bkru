const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample In-Memory Database (Mock)
const mockDB = [];

// GET /ping
app.get('/ping', (req, res) => {
  res.send('Pong');
});

// POST /get_mfa_key
app.post('/get_mfa_key', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  console.log('from get_mfa_key, email is', email);
  res.status(200).send({ message: '123456', email });
});

// POST /register
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send({ message: 'All fields required!' });
  }

  console.log(`from /regsiter, data is:\nusername: ${username}\nemail:${email}\npassword: ${password}`);
  mockDB.push({ username, password, email });
  res.status(200).send({ message: 'User saved to DB!', savedUser: { username, email } });
});

app.post('/confirm_code', (req, res) => {
    const { code } = req.body; 
    if (code === '1111') {
        res.status(200).send({
            message: "Code is valid!"
        });
    } else {
        res.status(400).send({
            message: "Wrong code, try again!"
        });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
