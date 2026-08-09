import { Router } from "express";
import { createChat, getChatById, getUserChats, addMessageToChat, deleteChat } from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getUserChats);
router.post("/", requireAuth, createChat);
router.get("/:chatId", requireAuth, getChatById);
router.delete("/:chatId", requireAuth, deleteChat);
router.post("/:chatId/messages", requireAuth, addMessageToChat);

export default router;
