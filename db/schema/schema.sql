-- drops to ensure creating from scratch
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  -- optional image
  image_url VARCHAR(255)
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  image_url VARCHAR(255),
  website_url VARCHAR(255)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id),
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  time_created TIMESTAMP NOT NULL,
  picked_up BOOLEAN NOT NULL DEFAULT FALSE,
  -- optional notes to inform restaurant of anything specific/necessary to the order.
  time_fulfilled TIMESTAMP DEFAULT NULL,
  notes TEXT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL DEFAULT 0,
  time_created TIMESTAMP NOT NULL,
  -- should just allow for a rating and no need to post a body
  body TEXT
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  -- do this in integers, convert on render
  cost INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  time_prepared TIMESTAMP DEFAULT NULL
);

