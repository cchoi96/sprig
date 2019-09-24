const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
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

    // const restaurantInfo = JSON.parse(req.body.orderInfo);
    const restaurantAndItemIds = JSON.parse(req.body.orderData);
    console.log(restaurantAndItemIds);
    let textData = {
      orderItem: []
    };

    let restaurantId = restaurantAndItemIds.restaurantId;
    let orderIdQuery = `INSERT INTO orders(customer_id, restaurant_id)
                             VALUES($1, $2)
                             RETURNING *`;

    const values = [req.session.user_id, restaurantId];
    db
      .query(orderIdQuery, values)
      .then(orderResponse => {
        let queries = [];
        let orderId = orderResponse.rows[0].id;
        textData.orderId = orderResponse.rows[0].id;

        let promises = [];
        for (let orderIndex = 0; orderIndex < restaurantAndItemIds.itemId.length; orderIndex++) {
          promises.push(
            new Promise(function(resolve, reject) {
              if (restaurantAndItemIds.quantity[orderIndex] !== '0') {
                let orderItemQuery = `INSERT INTO order_items(order_id, menu_item_id, quantity)
                VALUES($1, $2, $3)
                RETURNING *`;
                let orderItemValues = [orderId, restaurantAndItemIds.itemId[orderIndex], restaurantAndItemIds.quantity[orderIndex]];
                db
                .query(orderItemQuery, orderItemValues)
                .then(insertedOrderData => {
                  console.log('123');
                  textData.orderItem.push('sdlfkjsklfjs');
                  resolve();
                })
              }
            })
          )
        }

        Promise.all(promises)
          .then(() => {
            console.log('hi');
            console.log(textData);
          })

      })
      .catch(err => {
        console.error(err);
      })
    res.redirect('/cart');
  })
  return router;
}

