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
  // This should take the data from the newly created
  // order and render it to the restaurant.

  // @route     POST /sms
  // @desc      Sends an SMS
  router.post('/', (req, res) => {
    const twiml = new MessagingResponse();
    // Query for the order's contents:
    const queryString = `
      SELECT menu_items.name AS name, quantity FROM order_items
      JOIN menu_items ON order_items.menu_item_id = menu_items.id
      JOIN orders ON order_items.order_id = orders.id
      WHERE orders.id = $1
    `;
    // prepare the message and inform the restaurant:
    let message = `New order for you!\n`;

    db.query(queryString, [1])
    .then(resultSet => {
      for (row of resultSet.rows) {
        message += `${row.quantity} ${row.name}\n`
      }
      twiml.message(message);
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(twiml.toString());
    })
  });

  return router;
}
