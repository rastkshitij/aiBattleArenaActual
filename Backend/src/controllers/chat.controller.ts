import type { Response } from "express";
import Chat from "../models/Chat.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const chats = await Chat.find({ user: userId } as any).sort({ updatedAt: -1 });
    return res.status(200).json({ chats });
  } catch (error) {
    console.error("Fetch chats error:", error);
    return res.status(500).json({ message: "Unable to fetch chats" });
  }
};

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { title, firstMessage } = req.body;

    if (!title || !firstMessage) {
      return res.status(400).json({ message: "Title and first message are required" });
    }

    const chat = await Chat.create({
      user: req.user?.id,
      title,
      messages: [{ role: "user", content: firstMessage }],
    });

    return res.status(201).json({ chat });
  } catch (error) {
    console.error("Create chat error:", error);
    return res.status(500).json({ message: "Unable to create chat" });
  }
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await (Chat as any).findOne({ _id: req.params.chatId, user: req.user?.id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ chat });
  } catch (error) {
    console.error("Fetch single chat error:", error);
    return res.status(500).json({ message: "Unable to fetch chat" });
  }
};

export const addMessageToChat = async (req: AuthRequest, res: Response) => {
  try {
    const { role, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user?.id } as any);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.messages.push({ role: role || "user", content });
    if (chat.messages.length === 1) {
      chat.title = String(content).slice(0, 40) || "New chat";
    }

    await chat.save();
    return res.status(200).json({ chat });
  } catch (error) {
    console.error("Add message error:", error);
    return res.status(500).json({ message: "Unable to add message" });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response) => {
  try {
    const deletedChat = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user?.id } as any);

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({
      message: "Chat deleted successfully",
      chatId: req.params.chatId,
    });
  } catch (error) {
    console.error("Delete chat error:", error);
    return res.status(500).json({ message: "Unable to delete chat" });
  }
};
