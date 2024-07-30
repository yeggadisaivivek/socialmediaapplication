const express = require('express');
const { getCommentsByPostId, addCommentToPost } = require('../components/commentOfPostComponent');
const { use } = require('./authRoutes');
const router = express.Router();

// Lists all the comments for a post
router.get('/', async (req, res) => {
    const { userId, postId } = res.locals.params;;

    try {
        const response = await getCommentsByPostId(postId);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(200).json({ comments: response.comments });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { userId, postId } = res.locals.params;
    const { comment } = req.body;
    try {
        const response = await addCommentToPost(postId, userId, comment);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(201).json({ message: 'Comment added successfully', comment: response.comment });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;