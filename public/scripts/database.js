const db = require('../../db')

// getAllUsers
// Returns all users.
const getAllUsers = () => {
  const queryString = 'SELECT * FROM users';
  return db.query(queryString)
  .then((res) => (res.rows))
  .catch((err) => console.error(err));
};

exports.getAllUsers = getAllUsers;

// Gets a user by email
// Used in the login and register routes.
const getUserByEmail = (email) => {
  const queryString = `SELECT * FROM users WHERE email = $1`;
  return db.query(queryString, [email])
  .then((res) => res.rows[0])
  .catch((err) => console.error(err));
};

exports.getUserByEmail = getUserByEmail;

// getUserById
// Gets a user by id
// Used to check persistency of login connection, among other things
const getUserById = (id) => {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  return db.query(queryString, [id])
  .then((res) => res.rows)
  .catch((err) => console.error(err));
}

exports.getUserById = getUserById;

// Takes a restaurant id, returning all items in that restaurant's menu.
const getMenuItems = (restaurant_id) => {
  const queryString = `SELECT * FROM menu_items WHERE restaurant_id = $1`;
  return db.query(queryString, [restaurant_id])
  .then((res) => res.rows)
  .catch((err) => console.error(err));
}

exports.getMenuItems = getMenuItems;

// creates an order between a specific customer and restaurant.
// The item will be passed through the promise chain, used by the
// addItem funciton below:
const createOrder = (customer_id, restaurant_id) => {
  const queryString = `
  INSERT INTO orders (customer_id, restaurant_id, time_created)
  VALUES ($1, $2, now())
  RETURNING *
  `;
  const queryParams = [customer_id, restaurant_id];
  return db.query(queryString, queryParams)
  // return the one row with [0] index
  .then((res) => res.rows[0])
  .catch((err) => console.error(err));
}

exports.createOrder = createOrder;

// Adds an individual item to the order. Takes the id from the
// newly created order and adds to that.
const addItemToOrder = (order_id, menu_item_id, quantity) => {
  const queryString = `
  INSERT INTO order_items (order_id, menu_item_id, quantity)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const queryParams = [order_id, menu_item_id, quantity];
  return db.query(queryString, queryParams)
  .then((res) => res.rows[0])
  .catch((err) => console.error(err));
}

exports.addItemToOrder = addItemToOrder;

const getOrderById = (order_id) => {
  const queryString = `
  SELECT * FROM orders WHERE id = $1
  `;
  const queryParams = [order_id];
  return db.query(queryString, queryParams)
  .then((res) => res.rows[0])
  .catch((err) => console.error(err));
}

exports.getOrderById = getOrderById;
