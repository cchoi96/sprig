const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_NUMBER;
const client = require('twilio')(accountSid, authToken);
// const { generateRandomSMSId } = require('../public/scripts/helpers');

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

  // @route   GET /cart
  // @desc    Get cart confirmation page
  router.get('/', (req, res) => {
    data.user = req.session.user_id;
    data.error = req.session.email;
    res.render('confirmation', data);
  })

  // @route   POST /cart
  // @ desc   Search
  router.post('/', (req, res) => {
    // const orderInformation = JSON.parse(req.body.orderInfo);
    // const message = {};
    // const outboundMessages = [];
    // // const insertOrderQuery = `INSERT INTO orders ()`
    // for (key in orderInformation) {
    //   messages[key] = {};
    //   messages[key].body = `You have received a new order!\n`;
    //   // gonna have to get each individual # from the DB
    //   messages[key].number = `+16476378535`;
    //   messages[key].sms_code = generateRandomSMSId();
    //   let code = messages[key].sms_code;
    //   for (item in orderInformation[key]) {
    //     messages[key].body += `${orderInformation[key][item].quantity} ${item}\n`;
    //   }
    //   messages[key].body += `Text ${code} to accept this order at a default time of 10 minutes,\nor ${code} <number> to accept this order at the time in minutes specified.`;
    //   outboundMessages.push(messages[key]);
    // }
    // console.log(messages);

    // Promise.all(
    //   outboundMessages.map(message => {
    //     return client.messages.create({
    //       body: message.body,
    //       from: `+1${phoneNumber}`,
    //       to: message.number
    //     });
    //   })
    // )
    // .then(message => console.log(message.sid));
    // console.log(JSON.parse(req.body.orderInfo));
    // const restaurantInfo = JSON.parse(req.body.orderInfo);
    const restaurantAndItemIds = JSON.parse(req.body.orderData);
    console.log(restaurantAndItemIds);

    // client.messages
    //   .create({
    //     body: 'You have a new order! The order is ',
    //     from: phoneNumber,
    //     to: '+17788469842'
    //   })
    //   .then(message => console.log(message.sid));

    let restaurantId = restaurantAndItemIds.restaurantId;
    let orderIdQuery = `INSERT INTO orders(customer_id, restaurant_id, sms_code)
                             VALUES($1, $2, $3)
                             RETURNING *`;

    const values = [req.session.user_id, restaurantId, 9999];
    db
      .query(orderIdQuery, values)
      .then(orderResponse => {
        let orderId = orderResponse.rows[0].id;
        // Checks if quantity = 0. If not, it pushes it into the order_items table.
        for (let orderIndex = 0; orderIndex < restaurantAndItemIds.itemId.length; orderIndex++) {
          if (restaurantAndItemIds.quantity[orderIndex] !== '0') {
            let orderItemQuery = `INSERT INTO order_items(order_id, menu_item_id, quantity)
            VALUES($1, $2, $3)
            RETURNING *`;
            let orderItemValues = [orderId, restaurantAndItemIds.itemId[orderIndex], restaurantAndItemIds.quantity[orderIndex]];

            db
              .query(orderItemQuery, orderItemValues)
              .then(insertedOrderData => {
              })
          }
        }
      })
      .catch(err => {
        console.error(err);
      })
    res.redirect('/cart');
  })
  return router;
}

