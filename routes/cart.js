const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: false }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {
  // Data object to be passed into EJS
  let data = {
    user: '',
    error: {},
    restaurants: '',
    restaurant: '',
    orderInfo: '',
    email: ''
  };

  // @route   POST /cart
  // @ desc   Search
  router.post('/', (req, res) => {
    const data = JSON.parse(req.body.orderInfo);
    console.log(data);
    // client.messages.create({
   //   body: 'POST /cart',
   //   from: '+16474907450',
   //   to: '+16476378535'
   // })
   // .then((message) => console.log(message.sid));
  });

  return router;
};

