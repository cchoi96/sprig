const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const router = express.Router();

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
    const findUser = `SELECT customer_id FROM orders
                      WHERE orders.id = $1`;
    const findUserValues = [req.body.orderId];
    db
      .query(findUser, findUserValues)
      .then(userData => {
        let userId = userData.rows[0].customer_id;
        console.log('userdata', userData.rows[0]);
        const acceptOrder = `UPDATE orders
                           SET order_status = 'pending'
                           WHERE orders.id = $1`;
        const acceptOrderValues = [req.body.orderId];
        db
          .query(acceptOrder, acceptOrderValues)
          .then(() => {
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
            res.redirect('/restaurant');
          })
      })
      .catch(err => console.log(err));
  });

  router.get('/', (req, res) => {
      // Data object to be passed into EJS
      let data = {
        user: '',
      };
    data.email = req.session.email;
    data.user = req.session.user_id;
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
        console.log(data.orders);
      })
  });


  return router;
};