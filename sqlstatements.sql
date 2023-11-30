-- Inserting some test information. Using uuid_generate_v4() to generate random ids.
-- Maybe uuid isn't necessary for categories but may as well keep it consistent.

INSERT INTO users (user_id, username, email) VALUES (uuid_generate_v4(), 'john_doe', 'john@example.com');

INSERT INTO categories (category_id, category_name) VALUES (uuid_generate_v4(), 'Technology');

INSERT INTO posts (post_id, title, content, user_id, category_id) VALUES (
    uuid_generate_v4(), 
    'Post Title', 
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
    (SELECT user_id FROM users ORDER BY RANDOM() LIMIT 1), 
    (SELECT category_id FROM categories ORDER BY RANDOM() LIMIT 1)
);

-- Select statements.

SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM posts;
SELECT 
	posts.title,
	posts.content,
	posts.created_on,
	users.username AS username,
	categories.category_name AS category
FROM posts
JOIN users ON posts.user_id = users.user_id
JOIN categories ON posts.category_id = categories.category_id;

-- An update statement.

UPDATE posts
SET content = 'Hey look, there be some new content here!'
WHERE post_id = '4d1741bf-7e55-4d2f-9a0b-bd45d04b1819';

SELECT content FROM posts
WHERE post_id = '4d1741bf-7e55-4d2f-9a0b-bd45d04b1819';
-- Worked as expected!

-- Deleting the information I added.

DELETE FROM posts WHERE post_id = '4d1741bf-7e55-4d2f-9a0b-bd45d04b1819';
DELETE FROM users WHERE user_id = '766ce95e-e21e-476a-b22f-ba0be802fc03';
DELETE FROM categories WHERE category_id = '0414b453-f986-4db4-b826-c0246061b2b7';

SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM posts;
-- SUccessfully deleted!