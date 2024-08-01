const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const pool = require('../db');

// Register a new user
const register = async (userData) => {
  const { username, password, name } = userData;

  try {
    // Check if username already exists
    const [userCheckResults] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (userCheckResults.length > 0) {
      throw new Error('Username already exists');
    }

    // Hash the password and insert the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    const [insertUserResult] = await pool.query('INSERT INTO users SET ?', newUser);

    const newUserId = insertUserResult.insertId;

    // Insert a new row in the user_data table
    const newUserData = { user_id: newUserId, name };
    await pool.query('INSERT INTO user_data SET ?', newUserData);

    // Insert a new row in the followers table
    const newFollowerData = { user_id: newUserId };
    await pool.query('INSERT INTO followers SET ?', newFollowerData);

    return { message: 'User registered successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};
// Login a user
const login = async (userData) => {
  const { username, password } = userData;
  
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (results.length === 0) {
      throw new Error('User not found');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });

    return { token, userId: user.id };
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = { register, login };
