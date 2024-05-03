const jwt = require('jsonwebtoken');
require('dotenv').config()

const SECRET_KEY = process.env.JWT_SERCRET_KEY;  // Replace with your secret key
const TOKEN_EXPIRATION = '1h';  // Token expiration time, e.g., 1 hour

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

module.exports = generateToken;
