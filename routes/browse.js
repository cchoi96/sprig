const express = require('express');
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
    errorMessage: false
  };

  // @route   GET /browse
  // @ desc   Render browse page
  router.get('/', (req, res) => {
    res.render('/browse', data);
  });

  // @route   POST /browse
  // @ desc   Search
  router.post('/', (req, res) => {
    // Checking if forms are filled out
    let emptyField = req.body.email.length === 0 || req.body.password.length === 0 ? true : false;

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
            res.render('/browse', data);
          }
        })
        .catch(err => {
          console.error(err);
          data.errorMessage = true;
          res.render('/browse', data);
        });
    }
  });
  return router;
};
