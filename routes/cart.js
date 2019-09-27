const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsSource = `+1${process.env.TWILIO_PHONE_NUMBER}`;
const client = require('twilio')(accountSid, authToken);

// const { generateRandomSMSId } = require('../public/scripts/helpers');
  router.use(bodyParser.urlencoded({ extended: false }));
    router.use(cookieSession({
    name: 'user_id',
    keys: ['id']
  }));

  module.exports = (db) => {
  // @route   GET /cart
  // @desc    Get cart confirmation page
  router.get('/', (req, res) => {
    // Data object to be passed into EJS
    let data = {
      user: req.session.user_id,
      email: req.session.email,
      image_url: req.session.image_url
    };
    res.render('confirmation', data);
  })
  // @route   POST /cart
  // @ desc   Search
  router.post('/', (req, res) => {
    // Data object to be passed into EJS
    let data = {
      user: req.session.user_id,
      error: {},
      restaurants: '',
      restaurant: '',
      orderInfo: '',
      email: req.session.email
    };
    // const restaurantInfo = JSON.parse(req.body.orderInfo);
    const restaurantAndItemIds = JSON.parse(req.body.orderData);
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
        // Checks if quantity = 0. If not, it pushes it into the order_items table.
        for (let orderIndex = 0; orderIndex < restaurantAndItemIds.itemId.length; orderIndex++) {
          if (restaurantAndItemIds.quantity[orderIndex] !== '0') {
            let orderItemQuery = `INSERT INTO order_items(order_id, menu_item_id, quantity)
            VALUES($1, $2, $3)
            RETURNING *`;
            let orderItemValues = [orderId, restaurantAndItemIds.itemId[orderIndex], restaurantAndItemIds.quantity[orderIndex]];
            queries.push(db.query(orderItemQuery, orderItemValues));
          }
        }
        Promise.all(queries)
          .then(insertedOrderData => {
            let orderId = insertedOrderData[0].rows[0].order_id;
            let queryString =
            `
            SELECT menu_items.name, order_items.quantity, order_items.order_id
            FROM order_items
            JOIN menu_items ON order_items.menu_item_id = menu_items.id
            WHERE order_items.order_id = $1
            `;
            let queryParams = [orderId];
            db.query(queryString, queryParams)
              .then(resultSet => {
                let outgoingMessage = `New order details:\n=================\n`;
                outgoingMessage += `Order #${resultSet.rows[0].order_id}:\n`
                for (row of resultSet.rows) {
                  outgoingMessage += `${row.quantity} ${row.name}\n`;
                }
                outgoingMessage += `Please update this order by logging into your Sprig account.`;
                client.messages.create({
                  body: outgoingMessage,
                  from: smsSource,
                  to: `+17788469842`
                })
                .then(message => message.sid)
                .catch(err => console.error(err));
              })
          })

          .catch(err => {
            console.log(`ERROR: ${err}`);
          })
        })
      .catch(err => {
        console.error(err);
      })
    res.redirect('/cart');
  })
  return router;
  }
