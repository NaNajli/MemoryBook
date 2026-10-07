-- ============================================
-- MEMORY BOOK DATABASE SCHEMA
-- ============================================

-- --------------------------------------------
-- USERS
-- --------------------------------------------

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- --------------------------------------------
-- MEMORY BOOKS
-- --------------------------------------------

CREATE TABLE memory_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,

    title VARCHAR(200) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_memory_books_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- --------------------------------------------
-- MEMORIES
-- --------------------------------------------

CREATE TABLE memories (
    id SERIAL PRIMARY KEY,
    memory_book_id INTEGER NOT NULL,

    title VARCHAR(200) NOT NULL,
    topic VARCHAR(100),
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_memories_memory_book
        FOREIGN KEY (memory_book_id)
        REFERENCES memory_books(id)
        ON DELETE CASCADE
);


-- --------------------------------------------
-- MEMORY IMAGES
-- --------------------------------------------

CREATE TABLE memory_images (
    id SERIAL PRIMARY KEY,
    memory_id INTEGER NOT NULL,

    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_memory_images_memory
        FOREIGN KEY (memory_id)
        REFERENCES memories(id)
        ON DELETE CASCADE
);


-- --------------------------------------------
-- INDEXES
-- --------------------------------------------

CREATE INDEX idx_memory_books_user_id
    ON memory_books(user_id);

CREATE INDEX idx_memories_memory_book_id
    ON memories(memory_book_id);

CREATE INDEX idx_memories_topic
    ON memories(topic);

CREATE INDEX idx_memory_images_memory_id
    ON memory_images(memory_id);

CREATE INDEX idx_users_email
    ON users(email);