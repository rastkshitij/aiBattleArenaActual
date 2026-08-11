import jwt from "jsonwebtoken";
import config from "../config/config.js";
export const signToken = (userId) => {
    return jwt.sign({ userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};
//# sourceMappingURL=token.js.map