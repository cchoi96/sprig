INSERT INTO users (id, name, email, password, phone_number, owns_restaurant)
VALUES
(
  'AAAAAA',
  'Bob Jones',
  'bobjones@bob.com',
  -- bcrypt hashed version of the word 'password' for all users
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535,
  FALSE
),
(
  'BBBBBB',
  'Cindy Jones',
  'cindyjones@bob.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4164445556,
  FALSE
),
(
  'CCCCCC',
  'Reggie Brown',
  'rbrown@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  7788469842,
  TRUE
),
(
  'DDDDDD',
  'Andrea Smith',
  'andrea@hardtack.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4168888054,
  TRUE
),
(
  'EEEEEE',
  'Frank Black',
  'frankblack@hotmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4169067445,
  TRUE
),
(
  'FFFFFF',
  'James Tran',
  'james@redspin.net',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535,
  TRUE
),
(
  'GGGGGG',
  'Tommy Chang',
  'tom@jerry.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535,
  FALSE
),
(
  'HHHHHH',
  'John Athanasidis',
  'john@bluebird.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535,
  TRUE
)
