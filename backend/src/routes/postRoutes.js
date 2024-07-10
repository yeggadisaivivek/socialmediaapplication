const express = require('express');
const { allPosts, getAllPostsOfUser } = require('../models/posts');
const router = express.Router();

const likeRoutes = require('./likesOfPostRoutes');
const commentRoutes = require('./commentsOfPostRoutes');

// Lists all posts of the user
router.get('/', async (req,res) => {
    const userID = req.params.userId;
    try {
        const response = await getAllPostsOfUser(userID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:postId', async (req,res) => {});

router.post('/', async (req,res) => {});

router.put('/:postId', async (req,res) => {});

router.delete('/:postId', async (req,res) => {});

// Lists all the posts of its follwers and his posts as well
router.get('/all-posts', async (req, res) => {
    const userID = req.params.userId;
    try {
        const response = await allPosts(userID);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.use('/:postId/likes', likeRoutes);
router.use('/:postId/comments', commentRoutes);

module.exports = router;