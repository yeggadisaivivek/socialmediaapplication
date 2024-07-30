const express = require('express');
const { allPosts, getAllPostsOfUser, createPost, deletePost } = require('../models/posts');
const router = express.Router();

const likeRoutes = require('./likesOfPostRoutes');
const commentRoutes = require('./commentsOfPostRoutes');

router.use('/' ,(req,res,next) => {
    console.log("posts middleware hit")
    next();
})

// Lists all posts of the user
router.get('/all-posts', async (req,res) => {
    const {userId} = res.locals.params;
    try {
        const response = await allPosts(userId);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req,res) => {
    const {userId} = res.locals.params;
    try {
        const response = await getAllPostsOfUser(userId);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/:postId', async (req,res) => {});

router.post('/', async (req,res) => {
    const {userId} = res.locals.params;
    const { caption, profilePicUrl, mediaType } = req.body;
    try {
        const response = await createPost(userId, caption, mediaType, profilePicUrl);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response.error });
        } else {
            res.status(201).json({ message: 'Post created Successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:postId', async (req,res) => {});

router.delete('/:postId', async (req,res) => {
    const postId = req.params.postId;
    try {
        const response = await deletePost(postId);
        if (response.error) {
            res.status(500).json({ message: 'Server error', error: response?.error });
        } else {
            res.status(200).json({ message: response.message, body: response });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.use('/:postId/likes', (req, res, next) => {
    res.locals.params = {...res.locals.params, ...req.params}
    next();
}, likeRoutes);
router.use('/:postId/comments', (req, res, next) => {
    res.locals.params = {...res.locals.params, ...req.params};
    next();
}, commentRoutes);

module.exports = router;