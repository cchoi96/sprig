const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const helpers = require('../public/scripts/helpers');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {
  // @route   GET /register
  // @ desc   Render register page
  router.get('/', (req, res) => {
    res.render('/register', user);
  });

  // @route   POST /register
  // @ desc   Send user data through register page
  router.post('/', (req, res) => {
    // Checking if forms are filled out
    let emptyField = req.body.email.length === 0 || req.body.password.length === 0 ? true : false;

    if (emptyField) {
      // Should update this to send error message instead D:"
      res.status(400).send('One or both of the email or password fields is/are empty!');
    } else {
      // Generating credentials
      const userId = helpers.generateRandomId();
      const password = bcrypt.hashSync(req.body.password, 10);
      const defaultImage = req.body.image_url ? req.body.image_url : 'https://cdn.onlinewebfonts.com/svg/img_365985.png';

      // Sanitizing inputs
      const query = `INSERT INTO users(id, name, email, password, phone_number, image_url)
                        VALUES($1, $2, $3, $4, $5, $6, $7)
                        RETURNING *
                        `;
      const values = [userId, req.body.name, req.body.email, password, req.body.phone_number, defaultImage];

      // Data object to be passed into EJS
      let data = {
        user: ''
      };

      db
        .query(query, values)
        .then(res => {
          console.log(res);
          data.user = res.rows[0].name;
          res.render('/', data);
        })
        .catch(err => {
          console.error(err);
          res.render('/', data);
        });
    }
  });
  return router;
};
