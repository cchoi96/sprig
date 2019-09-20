const db = require('../../db')

const queryAllUsers = () => {
  const queryString = 'SELECT * FROM users';
  db.query(queryString)
  .then((res) => res.rows)
  .catch((err) => console.error(err));
};

const queryUserByEmail = (email) => {
  const queryString = `SELECT * FROM users WHERE email = $1`;
  db.query(queryString, [email])
  .then((res) => res.rows)
  .catch((err) => console.error(err));
};

const queryUserById = (id) => {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  db.query(queryString, [id])
  .then((res) => res.rows)
  .catch((err) => console.error(err));
}

// Takes a restaurant id, returning all items in that restaurant's menu.
const getMenuItems = (restaurant_id) => {
  const queryString = `SELECT * FROM menu_items WHERE restaurant_id = $1`;
  db.query(queryString, [restaurant_id])
  .then((res) => res.rows)
  .catch((err) => console.error(err));
}

// creates an order between a specific customer and restaurant.
// The item will be passed through the promise chain, used by the
//
const createOrder = (customer_id, restaurant_id) => {

}

// Adds an individual item to the order.
const addItemToOrder = (item) => {

}


