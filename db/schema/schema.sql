-- drops to ensure creating from scratch
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE users (
  -- anticipating the security risk from a sequential users key
  id VARCHAR(6) PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  -- optional image
  image_url VARCHAR(255) DEFAULT 'http://genslerzudansdentistry.com/wp-content/uploads/2015/11/anonymous-user.png',
  owns_restaurant BOOLEAN DEFAULT FALSE
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  owner_id VARCHAR(6) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  image_url VARCHAR(255) DEFAULT 'http://genslerzudansdentistry.com/wp-content/uploads/2015/11/anonymous-user.png',
  website_url VARCHAR(255)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR(6) NOT NULL REFERENCES users(id),
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  time_created TIMESTAMP NOT NULL DEFAULT now(),
  picked_up BOOLEAN NOT NULL DEFAULT FALSE,
  time_fulfilled TIMESTAMP DEFAULT NULL,
  -- order status can be 'not accepted', 'pending', 'complete'
  order_status VARCHAR(15) NOT NULL DEFAULT 'not accepted'
  -- future implementation
  -- optional notes to inform restaurant of anything specific/necessary to the order.
  -- notes TEXT
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  reviewer_id VARCHAR(6) NOT NULL REFERENCES users(id),
  -- future implementation
  -- rating INTEGER NOT NULL DEFAULT 5,
  time_created TIMESTAMP NOT NULL,
  body TEXT
);

CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cost_in_cents INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  time_prepared TIMESTAMP DEFAULT NULL
);

-- permissions on db
GRANT ALL PRIVILEGES ON reviews TO PUBLIC;
GRANT ALL PRIVILEGES ON reviews_id_seq TO PUBLIC;
GRANT ALL PRIVILEGES ON restaurants TO PUBLIC;
GRANT ALL PRIVILEGES ON restaurants_id_seq TO PUBLIC;
GRANT ALL PRIVILEGES ON users to PUBLIC;
GRANT ALL PRIVILEGES ON orders TO PUBLIC;
GRANT ALL PRIVILEGES ON orders_id_seq TO PUBLIC;
GRANT ALL PRIVILEGES ON order_items TO PUBLIC;
GRANT ALL PRIVILEGES ON order_items_id_seq TO PUBLIC;
GRANT ALL PRIVILEGES ON menu_items TO PUBLIC;
GRANT ALL PRIVILEGES ON menu_items_id_seq TO PUBLIC;

