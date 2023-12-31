// May want to add some better error handling here...

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
        const { title, content, existingCategory, newCategory } = req.body;
        const user = req.session.user;

        if (!user) {
            return res.redirect('/signin');
        }

        let categoryId;
        if (newCategory) {
            const newCategoryId = await dal.createCategory({ category_name: newCategory });
            categoryId = newCategoryId;
        } else {
            categoryId = existingCategory;
        }
        console.log("APIROUTES New Post Category ID: ", categoryId);
        // console.log("Recieved data: ", title, content);
        const newPost = await dal.createPost({ title, content, category_id: categoryId, user_id: user.user_id });
        console.log("APIROUTES New Post: ", newPost);
        // console.log("Created post: ", newPost);
        res.redirect(`/posts/${newPost.post_id}`);
    } catch (error) {
        console.log("Error creating post: ", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/posts/:id', async (req, res) => {
    // await handlePostUpdate(req, res);
    const postId = req.params.id;
    const { title, content, existingCategory, newCategory } = req.body;

    let categoryId;
    if (newCategory) {
        const newCategoryId = await dal.createCategory({ category_name: newCategory });
        categoryId = newCategoryId;
    } else {
        categoryId = existingCategory;
    }
    console.log("APIROUTES Category ID: ", categoryId);

    const updatedPost = await dal.updatePost(postId, { title, content, category_id: categoryId });
    console.log("APIROUTES Updated Post: ", updatedPost);

    if (!updatedPost) {
        return res.status(404).send('Post not found');
    }

    res.json(updatedPost);
});

router.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;

    const deletedPost = await dal.deletePost(postId);

    if (!deletedPost) {
        return res.status(404).send('Post not found');
    }

    res.json(deletedPost);
});

router.post('/users', async (req, res) => {
    try {
        const { username } = req.body;
        const newUser = await dal.createUser({ username });
        res.json(newUser);
    } catch {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/users/:username', async (req, res) => {
    try {
        const user = await dal.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
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

//     res.json(updatedPost);
// }

// Other routes here later...

module.exports = router;