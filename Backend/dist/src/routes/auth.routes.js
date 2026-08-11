import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", requireAuth, getCurrentUser);
export default router;
//# sourceMappingURL=auth.routes.js.map