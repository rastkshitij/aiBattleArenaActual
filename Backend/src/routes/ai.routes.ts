import { Router } from "express";
import { invokeAI } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, invokeAI);

export default router;
