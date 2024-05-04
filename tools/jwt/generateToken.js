const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SERCRET_KEY; // Replace with your secret key

const generateToken = (payload, TOKEN_EXPIRATION) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

module.exports = generateToken;
