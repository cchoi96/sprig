INSERT INTO users (user_id, name, email, password, phone_number)
VALUES
(
  'AAAAAA',
  'Bob Jones',
  'bobjones@bob.com',
  -- bcrypt hashed version of the word 'password' for all users
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535
),
(
  'BBBBBB',
  'Cindy Jones',
  'cindyjones@bob.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4164445556
),
(
  'CCCCCC',
  'Reggie Brown',
  'rbrown@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  9053323336
),
(
  'DDDDDD',
  'Andrea Smith',
  'andrea@hardtack.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4168888054
),
(
  'EEEEEE',
  'Frank Black',
  'frankblack@hotmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4169067445
);
