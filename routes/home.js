const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
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
    if (req.body.searchTerm !== "") {
      const searchValue = [req.body.search_term.toLowerCase(), `%${req.body.search_term.toLowerCase()}%`];
      const queryString =
      `
      SELECT *
      FROM restaurants
      WHERE levenshtein(lower(restaurants.name), $1) <= 3
      OR levenshtein(lower(restaurants.type), $1) <= 3
      OR lower(restaurants.name) LIKE $2
      `;
      db.query(queryString, searchValue)
        .then(resultSet => {
          data.restaurants = resultSet.rows;
          console.log(data.restaurants);
          res.render('browse', data);
        })
        .catch(err => console.error(err));
    }
    // const googleSearchQuery = searchQuery.replace(/ /g, '+');
    // const apiKey = process.env.MAPS_API_KEY;
  });

  return router;
};
