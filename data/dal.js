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

// Add other methods here...

module.exports = {
    getAllPosts,
    getPostById
    // Add other methods here...
}