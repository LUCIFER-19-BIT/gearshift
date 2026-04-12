const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";
const TOKEN_EXPIRES_IN = "1h";

const extractBearerToken = (req) => req.header("Authorization")?.replace("Bearer ", "") || "";

const signAuthToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

const verifyAuthToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  extractBearerToken,
  signAuthToken,
  verifyAuthToken,
};
