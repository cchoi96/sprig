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

  // Data object to be passed into EJS
  let data = {
    user: '',
    error: {
      registerError: false,
      loginError: false
    }
  };

  // @route   GET /register
  // @ desc   Render register page
  router.get('/', (req, res) => {
    res.render('register', data);
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
      const queryEmail = 'SELECT * FROM users WHERE email = $1';
      const insertUser = `INSERT INTO users(id, name, email, password, phone_number, image_url)
                        VALUES($1, $2, $3, $4, $5, $6)
                        RETURNING *
                        `;
      const emailValue = [req.body.email];
      const userValue = [userId, req.body.name, req.body.email, password, req.body.phone_number, defaultImage];

      db
        .query(queryEmail, emailValue)
        .then(res => {
          return res.rows.length === 0 ? db.query(insertUser, userValue) : null;
        })
        .then(newUser => {
          if (newUser === null) {
            data.error.registerError = true;
            console.log(data);
            res.render('register', data);
          } else {
            let response = newUser.rows[0];
            data.user = response.name;
            req.session.user_id = newUser.rows[0].id;
            data.email = response.email;
            res.render('home', data);
          }
        })
        .catch(err => {
          console.error(err);
          data.
          res.render('home', data);
        });
    }
  });
  return router;
};