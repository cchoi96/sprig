// 1. Generates the short URL, 6 characters long
const generateRandomId = () => {
  let string = '';
  const length = 6;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return string;
};

// Generates a random SMS id for an order
const generateRandomSMSId = () => {
  let string = ``;
  const length = 4;
  // limit it to numbers
  const chars = '0123456789';
  for (let i = 0; i < length; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

module.exports = {
  generateRandomId,
  geenrateRandomSMSId
};
