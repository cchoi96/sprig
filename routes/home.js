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
  router.get("/", (req, res) => {
    db
      .query(`SELECT name FROM users WHERE ${req.session.user_id} = id LIMIT 1`)
      .then(res => {
        let data = {
          user: res.rows[0].name
        }
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