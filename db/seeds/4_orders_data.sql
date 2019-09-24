-- order dummy data, set up the orders with some order items:

INSERT INTO orders (customer_id, restaurant_id) VALUES
(
  'DDDDDD',
  3
),
(
  'EEEEEE',
  2
),
(
  'AAAAAA',
  1
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
