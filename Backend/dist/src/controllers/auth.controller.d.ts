import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
export declare const registerUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logoutUser: (_req: AuthRequest, res: Response) => Response<any, Record<string, any>>;
export declare const getCurrentUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map