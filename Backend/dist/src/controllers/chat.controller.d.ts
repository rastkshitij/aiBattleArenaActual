import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare const getUserChats: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createChat: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getChatById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addMessageToChat: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteChat: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=chat.controller.d.ts.map