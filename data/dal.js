const { Pool } = require('pg');

// Maybe put in a separate file. Refer to Peter's lectures.
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FS-DB-QAP3',
    password: 'Keyin2021',
    port: 5432,
});

const getAllPosts = async () => {
    const { rows } = await pool.query('SELECT * FROM posts');
    return rows;
};

const getPostById = async (post_id) => {
    const { rows } = await pool.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);
    return rows[0];
};

const createPost = async ({ title, content, category_id }) => {
    const query = 'INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [title, content, category_id];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const updatePost = async (post_id, { title, content }) => {
    const query = 'UPDATE posts SET title = $1, content = $2, updated_on =  CURRENT_TIMESTAMP WHERE post_id = $3 RETURNING *';
    const values = [title, content, post_id];

    console.log("Query: ", query);
    console.log("Values: ", values);

    const { rows } = await pool.query(query, values);

    return rows[0];
};

const deletePost = async (post_id) => {
    const query = 'DELETE FROM posts WHERE post_id = $1 RETURNING *';
    const values = [post_id];

    const { rows } = await pool.query(query, values);

    return rows[0];
};

const createCategory = async ({ category_name }) => {
    const query = 'INSERT INTO categories (category_name) VALUES ($1) RETURNING category_id';
    const values = [category_name];

    const { rows } = await pool.query(query, values);
    return rows[0].category_id;
};

const getAllCategories = async () => {
    const { rows } = await pool.query('SELECT * FROM categories');
    return rows;
}

// Add other methods here...

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createCategory,
    getAllCategories,
    // Add other methods here...
}