const express = require('express');
const { getUserDataByUserID, createUserDataByUserID, updateUserDataByUserID } = require('../models/userData');
const router = express.Router();

router.get('/',async (req, res) => {
    const userID = req.params.userId;
    
    try {
        const response = await getUserDataByUserID(userID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: 'User retrieved successfully', body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    const userID = req.params.userId;
    const { name, bio, profilePicBase64Encoded } = req.body;

    try {
        const response = await createUserDataByUserID(userID, name, bio, profilePicBase64Encoded);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(201).json({ message: 'User created Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

})

router.put('/', async (req, res) => {
    const userID = req.params.userId;
    const { name, bio, profilePicBase64Encoded } = req.body;

    try {
        const response = await updateUserDataByUserID(userID, name, bio, profilePicBase64Encoded);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(201).json({ message: 'User created Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

})

module.exports = router;