INSERT INTO restaurants (owner_id, name, location, type, phone, email, image_url)
VALUES
-- will have same user owning them, pointing to
-- my phone number currently to test the SMS API
(
  'CCCCCC',
  'Greasy Burger Joint',
  '1212 Dufferin St.',
  'Diner',
  7788469842,
  'greasy@burgers.net',
  '/assets/restaurant-img/burger.jpg'
),
(
  'DDDDDD',
  'Santino Pizza',
  '235 Spadina Ave.',
  'Italian',
  7788469842,
  'santino@pizza.net',
  '/assets/restaurant-img/pizza.jpg'
),
(
  'EEEEEE',
  'Eddy the Eagle Barbeque',
  '154 King St. W',
  'Barbeque',
  7788469842,
  'eddy@eaglebbq.net',
  '/assets/restaurant-img/barbeque.jpg'
),
(
  'FFFFFF',
  'Hokkaido Classic Sushi',
  '330 Roncesvalles Ave',
  'Japanese',
  7788469842,
  'orders@hokkaidosushi.com',
  '/assets/restaurant-img/sushi.jpg'
),
(
  'HHHHHH',
  'Sinistro''s Coffee',
  '22 Portland St.',
  'Coffee',
  7788469842,
  'john@sinistro.com',
  '/assets/restaurant-img/coffee.jpg'
);
