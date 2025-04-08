const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
const port = 3001;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());

// 🔁 Test route for connectivity
app.get('/', (req, res) => {
  res.send('Backend is running 👋');
});

app.post('/auth/google', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Missing idToken' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    console.log(`✅ Google token verified for ${email}`);

    const user = {
      id: sub,
      email,
      name,
      picture,
    };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ user, token });
  } catch (error) {
    console.error('❌ Error verifying ID token:', error);
    res.status(401).json({ error: 'Invalid or expired ID token' });
  }
});

app.listen(port, () => {
  console.log(`✅ Auth server running on http://localhost:${port}`);
});