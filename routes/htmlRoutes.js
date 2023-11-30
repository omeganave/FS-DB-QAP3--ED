const express = require('express');
const router = express.Router();
const dal = require('../data/dal');

router.get('/', async (req, res) => {
    const posts = await dal.getAllPosts();
    res.render('index', { posts });
});

router.get('/posts/:id', async (req, res) => {
    const post = await dal.getPostById(req.params.id);
    res.render('show', { post });
});

// Other routes here later...

module.exports = router;