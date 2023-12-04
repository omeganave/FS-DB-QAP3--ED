CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	username VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE categories (
	category_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	category_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE posts (
	post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	content TEXT,
	user_id UUID REFERENCES users(user_id),
	category_id UUID REFERENCES categories(category_id),
	created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);