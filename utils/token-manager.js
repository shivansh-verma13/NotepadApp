import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (username, id, expiresIn) => {
  const payload = { username, id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (req, res, next) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not recieved" });
  }
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token not recieved" });
      } else {
        resolve();
        res.locals.jwtData = userData;
        return next();
      }
    });
  });
};
