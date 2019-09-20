INSERT INTO restaurants (owner_id, name, location, type, phone, email)
VALUES
-- will have same user owning them, pointing to
-- my phone number currently to test the SMS API
(
  1,
  'Greasy Burger Joint',
  '336 Baloney Lane',
  'Diner',
  6476378535,
  'greasy@burgers.net'
),
(
  1,
  'Santino Pizza',
  '235 Pizza Road',
  'Italian',
  6476378535,
  'santino@pizza.net'
),
(
  1,
  'Eddy the Eagle Barbeque',
  '150 Noodles Drive',
  'Barbeque',
  6476378535,
  'eddy@eaglebbq.net'
);
