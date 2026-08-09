import type { Response } from "express";
import graph from "../ai/graph.ai.js";
import Chat from "../models/Chat.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const invokeAI = async (req: AuthRequest, res: Response) => {
  try {
    const { input, chatId } = req.body;

    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    const result = await graph(String(input));

    if (chatId) {
      const chat = await Chat.findOne({ _id: chatId, user: req.user?.id } as any);
      if (chat) {
        chat.messages.push({ role: "user", content: input });
        chat.messages.push({ role: "assistant", content: result });
        chat.title = chat.title || String(input).slice(0, 40) || "New chat";
        await chat.save();
      }
    }

    return res.status(200).json({
      message: "Graph executed successfully",
      success: true,
      result,
    });
  } catch (error) {
    console.error("Invoke error:", error);
    return res.status(500).json({ message: "Unable to invoke the AI model" });
  }
};
