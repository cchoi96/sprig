-- order dummy data, set up the orders with some order items:

INSERT INTO orders (customer_id, restaurant_id, sms_code, time_created) VALUES
(
  'DDDDDD',
  3,
  '1111',
  now()
),
(
  'EEEEEE',
  2,
  '1379',
  now()
),
(
  'AAAAAA',
  1,
  '1456',
  now()
);

INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES
(
  1,
  12,
  1
),
(
  1,
  15,
  1
),
(
  2,
  9,
  1
),
(
  3,
  1,
  1
),
(
  3,
  4,
  2
);
