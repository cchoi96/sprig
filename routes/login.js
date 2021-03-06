const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {
  // @route   GET /login
  // @ desc   Render login page
  router.get('/', (req, res) => {
    // Data object to be passed into EJS
    let data = {
      user: '',
      error: {
        registerError: false,
        loginError: false
      },
      email: ''
    };
    res.render('login', data);
  });

  // @route   POST /login
  // @ desc   Send user data through login page
  router.post('/', (req, res) => {
    // Data object to be passed into EJS
    let data = {
      user: '',
      error: {
        registerError: false,
        loginError: false
      },
      email: ''
    };

    // Checking if forms are filled out
    let emptyField = req.body.email.length === 0 || req.body.password.length === 0 ? true : false;

    if (emptyField) {
      // Should update this to send error message instead D:"
      res.status(400).send('One or both of the email or password fields is/are empty!');
    } else {
      // Sanitizing inputs
      const getUser = `SELECT * FROM users
                     WHERE users.email = $1
                     LIMIT 1
                        `;
      const getUserValues = [req.body.email];

      db
        .query(getUser, getUserValues)
        .then(userInfo => {
          let response = userInfo.rows[0];
          // if the password is correct:
          if (response !== undefined && bcrypt.compareSync(req.body.password, response.password)) {
            req.session.user_id = response.id;
            req.session.email = response.email;
            req.session.image_url = response.image_url;
            data.user = response.name;
            data.email = response.email;
            console.log(response.email);
            data.error.loginError = false;
            data.image_url = response.image_url;
            if (response.owns_restaurant === false) {
              res.redirect('/browse');
            } else {
              res.redirect('/restaurant');
            }
          } else {
            data.error.loginError = true;
            res.render('login', data);
          }

        })
        .catch(err => {
          console.error(err);
          data.error.loginError = true;
          res.render('login', data);
        });
    }
  });
  return router;
};
