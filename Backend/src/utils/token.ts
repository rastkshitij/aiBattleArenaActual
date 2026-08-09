import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, config.JWT_SECRET as jwt.Secret, {
    expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  } as jwt.SignOptions);
};
