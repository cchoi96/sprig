const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // @route   POST /logout
  // @desc    Clear cookie
  router.post('/', (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/');
  });

  return router;
};