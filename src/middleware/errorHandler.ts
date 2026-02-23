import { AppError } from "../lib/AppError";
import type { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.log(`[Error]: ${err.message}`)

    if (err instanceof AppError) {
        res.status(err.statuscode).json({error: err.message})

        return
    }

    res.status(500).json({error: err.message})
}