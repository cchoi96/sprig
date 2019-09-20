INSERT INTO users (name, email, password, phone_number)
VALUES
(
  'Bob Jones',
  'bobjones@bob.com',
  -- bcrypt hashed version of the word 'password' for all users
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  6476378535
),
(
  'Cindy Jones',
  'cindyjones@bob.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4164445556
),
(
  'Reggie Brown',
  'rbrown@gmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  9053323336
),
(
  'Andrea Smith',
  'andrea@hardtack.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4168888054
),
(
  'Frank Black',
  'frankblack@hotmail.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
  4169067445
);
