const express = require('express');
const { getUsersWhoLikedPost, likeOrUnlikePost } = require('../components/likesOfPostComponent');
const router = express.Router();

// Lists all the users who liked the post. 
// Returns name and user_id
router.get('/', async (req,res) => {
    const postID = req.params.postId;
    try {
        const response = await getUsersWhoLikedPost(postID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Like or Unlike the post
router.post('/', async (req, res) => {
    const { userId, postId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    try {
        const response = await likeOrUnlikePost(userId, postId, action);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ message: response.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;