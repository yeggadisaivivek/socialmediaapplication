const express = require('express');
const { getAllUsersWithNames } = require('../models/users');
const router = express.Router();

const userDataRoutes = require('./userDataRoutes')
const followerRequestRoutes = require('./followerRequestRoutes')
const postRoutes = require('./postRoutes')
const followRoutes = require('./followerRoutes')

// Returns all the users with name
router.get('/', async (req, res) => {
    try {
        const response = await getAllUsersWithNames();
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: 'User retrieved successfully', body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.use('/:userId/userData', (req, res, next) => {
    res.locals.userId = req.params.userId;
    next();
}, userDataRoutes);
router.use('/:userId/followerRequest', (req, res, next) => {
    res.locals.userId = req.params.userId;
    next();
}, followerRequestRoutes);
router.use('/:userId/posts', (req, res, next) => {
    res.locals.params = req.params;
    next();
}, postRoutes);
router.use('/:userId/follower', (req, res, next) => {
    res.locals.userId = req.params.userId;
    next();
}, followRoutes);

module.exports = router;