const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {
  // Data object to be passed into EJS
  let data = {
    user: '',
  };
  // Intended for the restaurant user. Shows order history, pending orders, and other pertinent information.
  // Restaurant owners are redirected to this route on login.
  router.get('/', (req, res) => {
    data.email = req.session.email;
    data.user = req.session.user_id;
    const getRestaurantOwner = `SELECT * FROM restaurants
                                JOIN users ON restaurants.owner_id = users.id
                                JOIN menu_items ON menu_items.restaurant_id = restaurants.id
                                JOIN orders on orders.restaurant_id = restaurants.id
                                JOIN order_items ON order_items.order_id = orders.id
                                WHERE users.id = $1
                                AND order_items.quantity > 0
                                GROUP BY restaurants.id, users.id, menu_items.id, orders.id, order_items.id`;
    const values = [req.session.user_id];

    db
      .query(getRestaurantOwner, values)
      .then(restaurant => {
        let restaurantArr = restaurant.rows;
        const restaurantObj = {};

        for (let obj of restaurantArr) {
            if (!restaurantObj[obj.order_id]) {
              restaurantObj[obj.order_id] = {};
            }
            restaurantObj[obj.order_id][obj.name] = {
              price: obj.cost_in_cents,
              quantity: obj.quantity
            };
        }
        data.restaurantObj = restaurantObj;
        res.render('restaurant', data);
      })
  });
  return router;
};
