const express = require('express');
const { register, login } = require('../components/authComponent');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
