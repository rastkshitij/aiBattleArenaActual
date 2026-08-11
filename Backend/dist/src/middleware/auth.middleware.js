import jwt from "jsonwebtoken";
import config from "../config/config.js";
export const requireAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            email: "",
        };
        return next();
    }
    catch (_error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
//# sourceMappingURL=auth.middleware.js.map