import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createToken = (payload: Record<string, unknown>): string => {
  return jwt.sign(payload, process.env.TokenSecrete as Secret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.TokenSecrete as Secret);
  } catch (err) {
    console.log(err);
  }
};
