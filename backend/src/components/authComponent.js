const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register a new user
const register = (userData) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = userData;
    console.log("username::::"+username)
    console.log("password::::"+password)

    try {
      // Check if username already exists
      const checkUsernameSql = 'SELECT * FROM users WHERE username = ?';
      db.query(checkUsernameSql, [username], async (err, results) => {
        if (err) {
          return reject({ error: err.message });
        }

        if (results.length > 0) {
          return reject({ error: 'Username already exists' });
        }

        // Hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        const insertUserSql = 'INSERT INTO users SET ?';

        db.query(insertUserSql, newUser, (err, result) => {
          if (err) {
            return reject({ error: err.message });
          }

          resolve({ message: 'User registered successfully' });
        });
      });
    } catch (error) {
      reject({ error: error.message });
    }
  });
};

// Login a user
const login = (userData) => {
  return new Promise((resolve, reject) => {
    const { username, password } = userData;
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], async (err, results) => {
      if (err) {
        return reject({ error: err.message });
      }

      if (results.length === 0) {
        return reject({ error: 'User not found' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return reject({ error: 'Invalid credentials' });
      }

      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

      resolve({ token });
    });
  });
};

module.exports = { register, login };
