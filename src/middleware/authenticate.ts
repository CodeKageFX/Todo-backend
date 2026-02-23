import type { Request, Response, NextFunction } from "express";
import { verifyToken, type TokenPayload } from "../services/auth.services.ts";
import { AppError } from "../lib/AppError.ts";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("No token provided", 401);
        return;
    }

    const token = authHeader.split(" ")[1]
    if(!token) {
        throw new AppError("No token provided", 401)
    }

    const payload = verifyToken(token)

    req.user = payload
    
    next()
}

export function authorizeRoles(...roles: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError("You do not have permission to do this", 403);
            return;
        }
        next();
    };
}
