const { Pool } = require('pg');

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
}

const getPostById = async (post_id) => {
    const { rows } = await pool.query('SELECT * FROM posts WHERE post_id = $1', [post_id]);
    return rows[0];
}

const createPost = async ({ title, content }) => {
    const query = 'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *';
    const values = [title, content];

    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Add other methods here...

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    // Add other methods here...
}