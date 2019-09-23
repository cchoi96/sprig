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
    const twiml = new MessagingResponse();
    // req.body.Body for the Twilio message body.
    // console.log(req.body.Body);

    // do a query then render it into a message:
    const queryString = `SELECT name FROM users where id = $1`;

    db.query(queryString, [req.body.Body])
    .then(result => {
      let message = `Result: ${result.rows[0].name}`;
      twiml.message(message);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    })
    .catch(err => {
      console.error(err);
    })
  });

  return router;
}
