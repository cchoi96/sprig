const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.use(bodyParser.urlencoded({ extended: true }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {
  router.post('/', (req, res) => {
    console.log(req.body.Body);
  });
  return router;
}
