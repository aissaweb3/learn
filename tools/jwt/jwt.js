const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SERCRET_KEY; // Replace with your secret key

const generateToken = (payload, TOKEN_EXPIRATION) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

const verifyToken = (token) => {
  try {
    const decodedPayload = jwt.verify(token, SECRET_KEY);
    return decodedPayload;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token has expired.");
      return null;
    } else {
      console.log("Invalid token.");
      return null;
    }
  }
};

module.exports = { generateToken, verifyToken };
