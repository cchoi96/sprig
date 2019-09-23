-- order dummy data, set up the orders with some order items:

INSERT INTO orders (customer_id, restaurant_id, time_created) VALUES
(
  'DDDDDD',
  3,
  now()
),
(
  'EEEEEE',
  2,
  now()
),
(
  'AAAAAA',
  1,
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
