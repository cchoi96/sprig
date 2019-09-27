const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const fetch = require('node-fetch');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
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
        data.image_url = req.session.image_url;
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
      let queryString;
      if (searchValue !== '') {
        queryString =
        `
        SELECT *
        FROM restaurants
        WHERE levenshtein(lower(restaurants.name), $1) <= 3
        OR levenshtein(lower(restaurants.type), $1) <= 3
        OR lower(restaurants.name) LIKE $2
        `;
      } else {
        queryString =
        `
        SELECT * FROM restaurants
        `;
      }
      db.query(queryString, searchValue)
        .then(resultSet => {
          data.restaurants = resultSet.rows;
          data.apiKey = GOOGLE_API_KEY;
          data.addresses = [];
          data.image_url = req.session.image_url;
          console.log(data.restaurants[0]);
          for (row of resultSet.rows) {
            data.addresses.push(row.location);
          }
          console.log(data.addresses);
          res.render('browse', data);
        })
        .catch(err => console.error(err));
    }
    // const googleSearchQuery = searchQuery.replace(/ /g, '+');
    // const apiKey = process.env.MAPS_API_KEY;
  });

  return router;
};
