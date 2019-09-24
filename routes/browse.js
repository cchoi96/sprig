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
    error: {},
    restaurants: '',
    restaurant: '',
    orderInfo: '',
    email: ''
  };

  // @route   GET /browse/cart
  // @ desc   Receives information sent from individual restaurants and pushes it to cart.ejs, only if user is logged in
  router.post('/cart', (req, res) => {
    if (req.session.user_id) {
      data.orderInfo = req.body;
      res.render('cart', data);
    } else {
      res.redirect('/login');
    }
  });

  // @route   GET /browse/:restaurant_id
  // @ desc   Render browse page for individual restaurant
  router.get('/:restaurant_id', (req, res) => {
    const restaurantName = req.params.restaurant_id.split('%20').join(' ');
    const query = `SELECT *
                   FROM restaurants
                   JOIN menu_items ON restaurants.id = menu_items.restaurant_id
                   WHERE restaurants.name LIKE $1`;
    const values = [restaurantName];
    db
      .query(query, values)
      .then(restaurantData => {
        data.restaurantName = restaurantName;
        data.restaurantUrlName = req.params.restaurant_id;
        data.restaurantData = restaurantData.rows;
        res.render('individual_restaurant', data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  // @route   GET /browse
  // @ desc   Render browse page
  router.get('/', (req, res) => {
    data.email = req.session.email;
    data.user = req.session.user_id;
    const query = `SELECT * FROM restaurants`;
    db
      .query(query)
      .then(restaurantData => {
        data.restaurants = restaurantData.rows;
        res.render('browse', data);
      })
      .catch(err => console.log(err));
  });

  // @route   POST /browse
  // @ desc   Search
  router.post('/', (req, res) => {
  });

  return router;
};
