import type { NextFunction, Request, Response } from "express";
export interface AuthUser {
    id: string;
    email: string;
}
export interface AuthRequest extends Request {
    user?: AuthUser;
}
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.middleware.d.ts.map