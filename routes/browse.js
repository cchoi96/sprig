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
    orderInfo: ''
  };

  // @route   GET /browse/:restaurant_id/submit
  // @ desc   Handle order submissions
  router.post('/:restaurant_id', (req, res) => {
    data.orderInfo = req.body;
    console.log(data);
  });

  // @route   GET /browse/:restaurant_id
  // @ desc   Render browse page for individual restaurant
  router.get('/:restaurant_id', (req, res) => {
    // Can run into issues if the restaurant name has a - in it.
    const restaurantName = req.params.restaurant_id.split('%20').join(' ');
    const query = `SELECT * 
                   FROM restaurants
                   JOIN menu_items ON restaurants.id = menu_items.restaurant_id
                   WHERE restaurants.name LIKE $1`;
    const values = [restaurantName];
    db
      .query(query, values)
      .then(restaurantData => {
        const restaurantInfo = restaurantData.rows;
        data.restaurant = restaurantInfo;
        data.restaurantName = restaurantName;
        data.restaurantUrlName = req.params.restaurant_id;
        res.render('individual_restaurant', data);
      })
      .catch(err => {
        console.log(err);
      });
  });

  // @route   GET /browse
  // @ desc   Render browse page
  router.get('/', (req, res) => {
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
