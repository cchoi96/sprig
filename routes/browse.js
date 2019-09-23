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
<<<<<<< HEAD
    const restaurantName = req.params.restaurant_id.split('%20').join(' ');
    const query = `SELECT * 
=======
    const restaurantName = req.params.restaurant_id.split('-').join(' ');
    const query = `SELECT *
>>>>>>> ebfbdf782b239584c8f46715af2ebde7bf2d1377
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

<<<<<<< HEAD
=======
    if (emptyField) {
      // Should update this to send error message instead D:"
      res.status(400).send('One or both of the email or password fields is/are empty!');
    } else {
      // Sanitizing inputs
      const query = `SELECT * FROM users
                     WHERE users.id = $1
                     LIMIT 1
                        `;
      const values = [req.body.username];

      db
        .query(query, values)
        .then(res => {
          if (bcrypt.compareSync(req.body.password, res.rows.password)) {
            req.session.user_id = res.rows.id;
            data.user = res.rows.name
            res.render('browse', data);
          }
        })
        .catch(err => {
          console.error(err);
          data.errorMessage = true;
          res.render('browse', data);
        });
    }
>>>>>>> ebfbdf782b239584c8f46715af2ebde7bf2d1377
  });

  return router;
};
