const express = require('express');
const { createFollowerRequest, getAllFollowerRequestsForUser, handleFollowerRequest } = require('../models/followerRequests');
const { updateFollowerStatus } = require('../components/followerRequestComponent');
const router = express.Router();

// Get all the follower requests for a user
router.get('/', async (req,res) => {
    const userID = res.locals.userId;;
    try {
        const response = await getAllFollowerRequestsForUser(userID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: 'Follower requests retrieved successfully', body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Responsible for creating a record in follower_requests table for accepeting/declining the requests
router.post('/', async (req, res) => {
    const userID = req.params.userId;
    const { requestIdFrom } = req.body;

    try {
        const response = await createFollowerRequest(userID,requestIdFrom);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(201).json({ message: 'User created Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

// Accept or Decline a request by providing the userId
router.put('/:followerId', async (req,res) => {
    const userID = res.locals.userId;
    const followerID = req.params.followerId;
    const { action } = req.body;
    try {
        const response = await handleFollowerRequest(userID, followerID, action);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: `${action} successfully`});
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;