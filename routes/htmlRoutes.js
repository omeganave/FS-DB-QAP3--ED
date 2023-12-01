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

router.get('/posts/:id/edit', async (req, res) => {
    const postId = req.params.id;
    const post = await dal.getPostById(postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('edit', { post, pageTitle: 'Edit Post', currentPage: 'Edit Post' });
});

// Not sure if both PUT and PATCH are needed, but the project requirements say to use both PUT and PATCH.
router.put('/posts/:id', async (req, res) => {
    // await handlePostUpdate(req, res);
    const postId = req.params.id;
    const { title, content } = req.body;

    const updatedPost = await dal.updatePost(postId, { title, content });

    if (!updatedPost) {
        return res.status(404).send('Post not found');
    }

    res.redirect(`/posts/${updatedPost.post_id}`);
});

// router.patch('/posts/:id', async (req, res) => {
//     await handlePostUpdate(req, res);
// });

// async function handlePostUpdate(req, res) {
//     const postId = req.params.id;
//     const { title, content } = req.body;

//     const updatedPost = await dal.updatePost(postId, { title, content });

//     if (!updatedPost) {
//         return res.status(404).send('Post not found');
//     }

//     res.redirect(`/posts/${updatedPost.post_id}`);
// }

// Other routes here later...

module.exports = router;