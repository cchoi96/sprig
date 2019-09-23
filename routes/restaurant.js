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

  router.get('/', (req, res) => {
    console.log(req.session.user_id);
    const getRestaurantOwner = `SELECT * FROM restaurants
                                JOIN users ON restaurants.owner_id = users.id
                                JOIN menu_items ON menu_items.restaurant_id = restaurants.id
                                JOIN orders on orders.restaurant_id = restaurants.id
                                JOIN order_items ON order_items.order_id = orders.id
                                WHERE users.id = $1
                                GROUP BY restaurants.id, users.id, menu_items.id, orders.id, order_items.id`;
    const values = [req.session.user_id];

    db
      .query(getRestaurantOwner, values)
      .then(restaurant => {
        let restaurantArr = restaurant.rows;
        const restaurantObj = {};

        for (let obj in restaurantArr) {
          restaurantObj[restaurantArr[obj].order_id] = {};
        }

        for (let obj in restaurantArr) {
          restaurantObj[restaurantArr[obj].name] = {};
        }

        for (let obj in restaurantArr) {
          restaurantObj[restaurantArr[obj].name].price = restaurantArr[obj].cost_in_cents;
          restaurantObj[restaurantArr[obj].name].quantity = restaurantArr[obj].quantity;
        }
        console.log(restaurantObj);
        res.render('restaurant', data);
      })
  });
  return router;
};