INSERT INTO restaurants (owner_id, name, location, type, phone, email, image_url)
VALUES
-- will have same user owning them, pointing to
-- my phone number currently to test the SMS API
(
  'CCCCCC',
  'Greasy Burger Joint',
  '336 Baloney Lane',
  'Diner',
  6476378535,
  'greasy@burgers.net',
  '/assets/restaurant-img/burger.jpg'
),
(
  'DDDDDD',
  'Santino Pizza',
  '235 Pizza Road',
  'Italian',
  6476378535,
  'santino@pizza.net',
  '/assets/restaurant-img/pizza.jpg'
),
(
  'EEEEEE',
  'Eddy the Eagle Barbeque',
  '150 Noodles Drive',
  'Barbeque',
  6476378535,
  'eddy@eaglebbq.net',
  '/assets/restaurant-img/barbeque.jpg'
),
(
  'FFFFFF',
  'Hokkaido Classic Sushi',
  '444 Seaweed Street',
  'Japanese',
  6476378535,
  'orders@hokkaidosushi.com',
  '/assets/restaurant-img/sushi.jpg'
),
(
  'HHHHHH',
  'Sinistro''s Coffee',
  '22 Caffeine Road',
  'Coffee',
  6476378535,
  'john@sinistro.com',
  '/assets/restaurant-img/coffee.jpg'
);
