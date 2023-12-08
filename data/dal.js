// Add error handling later...

const { Pool } = require('pg');

// Maybe put in a separate file. Refer to Peter's lectures.
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'FS-DB-QAP3',
    password: 'Keyin2021',
    port: 5432,
});

const getAllPosts = async (sortOption) => {
    // const { rows } = await pool.query('SELECT * FROM posts');
    // return rows;
    let query = 'SELECT posts.*, categories.category_name, users.username FROM posts LEFT JOIN categories ON posts.category_id = categories.category_id LEFT JOIN users ON posts.user_id = users.user_id';

    switch (sortOption) {
        case 'title_asc':
            query += ' ORDER BY title ASC';
            break;
        case 'title_desc':
            query += ' ORDER BY title DESC';
            break;
        case 'category_asc':
            query += ' ORDER BY category_name ASC';
            break;
        case 'category_desc':
            query += ' ORDER BY category_name DESC';
            break;
        case 'updated_on':
            query += ' ORDER BY updated_on DESC';
            break;
        default:
            query += ' ORDER BY updated_on DESC';
            break;
    }

    const { rows } = await pool.query(query);
    return rows;
};

const getPostById = async (post_id) => {
    const { rows } = await pool.query('SELECT posts.*, categories.category_name, users.username FROM posts LEFT JOIN categories ON posts.category_id = categories.category_id LEFT JOIN users ON posts.user_id = users.user_id WHERE posts.post_id = $1', [post_id]);
    return rows[0];
};

const createPost = async ({ title, content, category_id, user_id }) => {
    const query = 'INSERT INTO posts (title, content, category_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [title, content, category_id, user_id];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const updatePost = async (post_id, { title, content, category_id }) => {
    const query = 'UPDATE posts SET title = $1, content = $2, category_id = $3, updated_on =  CURRENT_TIMESTAMP WHERE post_id = $4 RETURNING *';
    const values = [title, content, category_id, post_id];

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
};

const createUser = async ({ username }) => {
    const query = 'INSERT INTO users (username) VALUES ($1) RETURNING *';
    const values = [username];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];

    const { rows } = await pool.query(query, values);
    return rows[0];
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
    createUser,
    getUserByUsername,
    // Add other methods here...
}