const express = require('express');
const router = express.Router();
const dal = require('../data/dal');

router.get('/', async (req, res) => {
    const posts = await dal.getAllPosts();
    res.render('index', { posts, pageTitle: 'Post List', currentPage: 'Post List' });
});

router.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await dal.getPostById(postId);
    if (!post) {
        res.status(404).send('Post not found');
    }
    res.render('show', { post, pageTitle: post.title, currentPage: 'Post Details' });
});

router.get('/new', (req, res) => {
    res.render('new', { pageTitle: 'Create a New Post', currentPage: 'Create a New Post' });
});

// Other routes here later...

module.exports = router;