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
  // Data object to be passed into EJS
  let data = {
    user: '',
    error: {
      registerError: false,
      loginError: false
    }
  };

  // @route   GET /login
  // @ desc   Render login page
  router.get('/', (req, res) => {
    res.render('login', data);
  });

  // @route   POST /login
  // @ desc   Send user data through login page
  router.post('/', (req, res) => {
    // Checking if forms are filled out
    let emptyField = req.body.email.length === 0 || req.body.password.length === 0 ? true : false;

    if (emptyField) {
      // Should update this to send error message instead D:"
      res.status(400).send('One or both of the email or password fields is/are empty!');
    } else {
      // Sanitizing inputs
      const query = `SELECT * FROM users
                     WHERE users.email = $1
                     LIMIT 1
                        `;
      const values = [req.body.email];

      db
        .query(query, values)
        .then(userInfo => {
          console.log(userInfo.rows[0]);
          let response = userInfo.rows[0];
          if (response !== undefined && bcrypt.compareSync(req.body.password, response.password)) {
            req.session.user_id = response.id;
            data.user = response.name;
            data.email = response.email;
            data.error.loginError = false;
            res.render('browse', data);
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