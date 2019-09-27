const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsSource = `+1${process.env.TWILIO_PHONE_NUMBER}`;
const client = require('twilio')(accountSid, authToken);

router.use(bodyParser.urlencoded({ extended: false }));

router.use(cookieSession({
  name: 'user_id',
  keys: ['id']
}));

module.exports = (db) => {

  router.post('/accept', (req, res) => {
    let data = {
      user: '',
    };
    data.email = req.session.email;
    data.user = req.session.user_id;
    data.image_url = req.session.image_url;
    const findUser = `SELECT customer_id FROM orders
                      WHERE orders.id = $1`;
    const findUserValues = [req.body.orderId];
    db
      .query(findUser, findUserValues)
      .then(userData => {
        let userId = userData.rows[0].customer_id;
        console.log('userdata', userData.rows[0].customer_id);
        const acceptOrder = `UPDATE orders
                           SET order_status = 'pending'
                           WHERE orders.id = $1`;
        const acceptOrderValues = [req.body.orderId];
        db
          .query(acceptOrder, acceptOrderValues)
          .then(() => {

          // get the user information to determine phone #
          const userPhoneNumberQuery =
          `
          SELECT phone_number FROM users
          JOIN orders ON users.id = orders.customer_id
          WHERE orders.id = $1;
          `;
          const queryParams = [req.body.orderId]
          db
            .query(userPhoneNumberQuery, queryParams)
            .then(resultSet => {
              let destination = `+1${resultSet.rows[0].phone_number}`;
              let minutes = 10;
              if (req.body.minutesToComplete !== "") {
                minutes = parseInt(req.body.minutesToComplete);
              }
              client.messages.create({
                body: `Your order will be ready in ${minutes} minutes!`,
                from: smsSource,
                to: destination
              })
              .then(message => console.log(message.sid))
              .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
            res.redirect('/restaurant');
          })
      })
      .catch(err => console.log(err));
  });

  router.post('/complete', (req, res) => {
    let data = {
      user: '',
    };
    data.email = req.session.email;
    data.user = req.session.user_id;
    const findUser = `SELECT customer_id FROM orders
                      WHERE orders.id = $1`;
    const findUserValues = [req.body.orderId];
    db
      .query(findUser, findUserValues)
      .then(userData => {
        let userId = userData.rows[0].customer_id;
        console.log('userdata', userData.rows[0]);
        const acceptOrder = `UPDATE orders
                           SET order_status = 'completed'
                           WHERE orders.id = $1`;
        const acceptOrderValues = [req.body.orderId];
        db
          .query(acceptOrder, acceptOrderValues)
          .then(() => {
          // get the user information to determine phone #
          const userPhoneNumberQuery =
          `
          SELECT phone_number FROM users
          JOIN orders ON users.id = orders.customer_id
          WHERE orders.id = $1;
          `;
          const queryParams = [req.body.orderId]
          db
            .query(userPhoneNumberQuery, queryParams)
            .then(resultSet => {
              let destination = `+1${resultSet.rows[0].phone_number}`;
              console.log(destination);
              // `+1${resultSet.rows[0].phoneNumber}`
              client.messages.create({
                body: `Your order is complete!`,
                from: smsSource,
                to: destination
              })
              .then(message => console.log(message.sid))
              .catch(err => console.error(err));
            })
            .catch(err => console.error(err));
            res.redirect('/restaurant');
          })
      })
      .catch(err => console.log(err));
  });

  router.get('/', (req, res) => {
      // Data object to be passed into EJS
      let data = {
        user: req.session.user_id,
        email: req.session.email
      };
    const getOrders = `SELECT orders.id, json_agg(json_build_object('name', menu_items.name, 'quantity', order_items.quantity)) as "items", orders.order_status as "status"
                                FROM restaurants
                                JOIN orders on orders.restaurant_id = restaurants.id
                                JOIN order_items ON order_items.order_id = orders.id
                                JOIN menu_items ON menu_items.id = order_items.menu_item_id
                                WHERE restaurants.owner_id = $1
                                AND order_items.quantity > 0
                                GROUP BY orders.id
                                ORDER BY orders.id DESC`;

    const values = [req.session.user_id];

    db
      .query(getOrders, values)
      .then(orders => {
        data.orders = orders.rows;
        res.render('restaurant', data);
      })
  });


  return router;
};
