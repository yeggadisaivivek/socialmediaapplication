const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register a new user
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, newUser, (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  });
};

module.exports = { register, login };
