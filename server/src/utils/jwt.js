import jwt from "jsonwebtoken";

export const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      username: admin.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h"
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};