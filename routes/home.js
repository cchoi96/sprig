const express = require('express');
const router  = express.Router();
const cookieSession = require('cookie-session');
const axios = require('axios');
// --------------------------------------------------------------------------------------------------------------------

router.use(cookieSession({
  name: 'user_id',
  keys: ["id"]
}));



module.exports = (db) => {

  let data = {
    user: '',
    errorMessage: false
  }
  router.get("/", (req, res) => {
    let query = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
    let values = [req.session.user_id];
    db
      .query(query, values)
      .then(user => {
        let response = user.rows[0];
        console.log(req.session.user_id);
        data.user = response.name;
        data.email = response.email;
        res.render('home', data);
      })
      .catch(err => {
        console.error(`There was a query error: ${err}`);
        let data = {
          user: null
        };
        res.render('home', data);
      })
  });

  router.post('/', (req, res) => {
    // const searchQuery = res.body.searchquery;
    // const googleSearchQuery = searchQuery.replace(/ /g, '+');
    // const apiKey = process.env.MAPS_API_KEY;
  });

  return router;
};
