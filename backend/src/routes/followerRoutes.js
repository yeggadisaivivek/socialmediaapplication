const express = require('express');
const { unfollowFollower, getFollowersForUser, updateFollowers } = require('../models/followers');
const router = express.Router();

router.put('/unfollow/:followerId', async (req,res) => {
    const userID = res.locals.userId;
    const followerID = req.params.followerId;
    try {
        const response = await unfollowFollower(userID, followerID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: 'Unfollowed Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.put('/follow/:followerId', async (req,res) => {
    const userID = res.locals.userId;
    const followerID = req.params.followerId;
    try {
        const response = await updateFollowers(userID, followerID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: 'followed Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/', async (req,res) => {
    const userID = req.params.userId;
    try {
        const response = await getFollowersForUser(userID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;