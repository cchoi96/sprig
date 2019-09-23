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
    const orderInformation = JSON.parse(req.body.orderInfo);
    const messages = {};
    const outboundMessages = [];
    for (key in orderInformation) {
      messages[key] = {};
      messages[key].body = `You have received a new order!\n`;
      // gonna have to get each individual # from the DB
      messages[key].number = `+16476378535`;
      for (item in orderInformation[key]) {
        messages[key].body += `${orderInformation[key][item].quantity} ${item}\n`;
      }
      messages[key].body += `Text YES to accept this order at a default time of 10 minutes,\nor YES <number> to accept this order at the time in minutes specified.`;
      outboundMessages.push(messages[key]);
    }
    console.log(messages);

    Promise.all(
      outboundMessages.map(message => {
        return client.messages.create({
          body: message.body,
          from: `+1${phoneNumber}`,
          to: message.number
        });
      })
    )
    .then(message => console.log(message.sid));
  });

  return router;
};

