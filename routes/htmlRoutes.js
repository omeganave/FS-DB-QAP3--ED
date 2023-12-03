const express = require('express');
const router = express.Router();
const dal = require('../data/dal');
const uuidValidate = require('uuid-validate');

router.get('/', async (req, res) => {
    try {
        const sortOption = req.query.sort || 'updated_on';
        const posts = await dal.getAllPosts(sortOption);
        const categories = await dal.getAllCategories();
        res.render('index', { posts, categories, pageTitle: 'Post List', currentPage: 'Post List' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

router.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    if (!uuidValidate(postId, 4)) {
        res.status(404).send('Invalid post ID <br> <a href="/">Back to Post List</a>');
        return;
    }

    try {
        // const postId = req.params.id;
        const post = await dal.getPostById(postId);
        if (!post) {
            res.status(404).send('Post not found <br> <a href="/">Back to Post List</a>');
        } else {
            res.render('show', { post, pageTitle: post.title, currentPage: 'Post Details' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

router.get('/new', async (req, res) => {
    try {
        const categories = await dal.getAllCategories();
        res.render('new', { categories, pageTitle: 'Create a New Post', currentPage: 'Create a New Post' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

router.get('/posts/:id/edit', async (req, res) => {
    const postId = req.params.id;
    if (!uuidValidate(postId, 4)) {
        res.status(404).send('Invalid post ID <br> <a href="/">Back to Post List</a>');
        return;
    }
    try {
        const post = await dal.getPostById(postId);
        const categories = await dal.getAllCategories();
        if (!post) {
            return res.status(404).send('Post not found <br> <a href="/">Back to Post List</a>');
        }
        res.render('edit', { post, categories, pageTitle: 'Edit Post', currentPage: 'Edit Post' });
        console.log("Showing edit page for post: ", post);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

// Not sure if both PUT and PATCH are needed, but the project requirements say to use both PUT and PATCH.
router.put('/posts/:id', async (req, res) => {
    // await handlePostUpdate(req, res);
    const postId = req.params.id;
    if (!uuidValidate(postId, 4)) {
        res.status(404).send('Invalid post ID <br> <a href="/">Back to Post List</a>');
        return;
    }
    try {
        const { title, content, existingCategory, newCategory } = req.body;
        let categoryId;
        if (newCategory) {
            const newCategoryId = await dal.createCategory({ category_name: newCategory });
            categoryId = newCategoryId;
        } else {
            categoryId = existingCategory;
        }
        console.log("HTMLROUTES Category ID: ", categoryId);
        const updatedPost = await dal.updatePost(postId, { title, content, category_id: categoryId });
        console.log("HTMLROUTES Updated Post: ", updatedPost);

        if (!updatedPost) {
            return res.status(404).send('Post not found <br> <a href="/">Back to Post List</a>');
        }

        res.redirect(`/posts/${updatedPost.post_id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

router.get('/posts/:id/delete', async (req, res) => {
    const postId = req.params.id;
    if (!uuidValidate(postId, 4)) {
        res.status(404).send('Invalid post ID <br> <a href="/">Back to Post List</a>');
        return;
    }
    try {
        const post = await dal.getPostById(postId);
        if (!post) {
            return res.status(404).send('Post not found <br> <a href="/">Back to Post List</a>');
        }
        res.render('delete', { post, pageTitle: 'Delete Post', currentPage: 'Delete Post' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
});

router.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    if (!uuidValidate(postId, 4)) {
        res.status(404).send('Invalid post ID <br> <a href="/">Back to Post List</a>');
        return;
    }

    try {
        const deletedPost = await dal.deletePost(postId);
        if (!deletedPost) {
            return res.status(404).send('Post not found <br> <a href="/">Back to Post List</a>');
        }
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error <br> <a href="/">Back to Post List</a>');
    }
})

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