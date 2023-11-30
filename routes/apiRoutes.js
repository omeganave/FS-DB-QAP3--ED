const express = require('express');
const router = express.Router();
const dal = require('../data/dal');

router.get('/posts', async (req, res) => {
    const posts = await dal.getAllPosts();
    res.json(posts);
});

router.get('/posts/:id', async (req, res) => {
    const post = await dal.getPostById(req.params.id);
    res.json(post);
});

router.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log("Recieved data: ", title, content);
        const newPost = await dal.createPost({ title, content });
        console.log("Created post: ", newPost);
        res.redirect(`/posts/${newPost.post_id}`);
    } catch (error) {
        console.log("Error creating post: ", error);
        res.status(500).send("Internal Server Error");
    }
    
})

// Other routes here later...

module.exports = router;