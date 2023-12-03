const express = require('express');
const router = express.Router();
const dal = require('../data/dal');

router.get('/', async (req, res) => {
    try {
        const sortOption = req.query.sort || 'updated_on';
        const posts = await dal.getAllPosts(sortOption);
        const categories = await dal.getAllCategories();
        res.render('index', { posts, categories, pageTitle: 'Post List', currentPage: 'Post List' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const post = await dal.getPostById(postId);
    if (!post) {
        res.status(404).send('Post not found');
    }
    res.render('show', { post, pageTitle: post.title, currentPage: 'Post Details' });
});

router.get('/new', async (req, res) => {
    // res.render('new', { pageTitle: 'Create a New Post', currentPage: 'Create a New Post' });
    try {
        const categories = await dal.getAllCategories();
        res.render('new', { categories, pageTitle: 'Create a New Post', currentPage: 'Create a New Post' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/posts/:id/edit', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await dal.getPostById(postId);
        const categories = await dal.getAllCategories();
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('edit', { post, categories, pageTitle: 'Edit Post', currentPage: 'Edit Post' });
        console.log("Showing edit page for post: ", post);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Not sure if both PUT and PATCH are needed, but the project requirements say to use both PUT and PATCH.
router.put('/posts/:id', async (req, res) => {
    // await handlePostUpdate(req, res);
    const postId = req.params.id;
    const { title, content, existingCategory, newCategory } = req.body;
    console.log("Received data: ", title, content, existingCategory, newCategory);

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
        return res.status(404).send('Post not found');
    }

    res.redirect(`/posts/${updatedPost.post_id}`);
});

router.get('/posts/:id/delete', async (req, res) => {
    const postId = req.params.id;
    const post = await dal.getPostById(postId);

    if (!post) {
        return res.status(404).send('Post not found');
    }

    res.render('delete', { post, pageTitle: 'Delete Post', currentPage: 'Delete Post' });
});

router.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;

    const deletedPost = await dal.deletePost(postId);

    if (!deletedPost) {
        return res.status(404).send('Post not found');
    }

    res.redirect('/');
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