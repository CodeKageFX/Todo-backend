import type { Request, Response, NextFunction } from "express";
import * as AuthServices from "../services/auth.services"
import { AppError } from "../lib/AppError";


export async function register(req: Request, res: Response, next:NextFunction) {
    try {
        const { email, password, role }  = req.body

        if(!email || !password) {
            throw new AppError("Email and Password are required", 400)
        }

        const result = await AuthServices.register(email, password, role)
        res.status(201).json({message: "User created successfully", result})
    } catch(err) {
        next(err)
    }
}

export async function login (req: Request, res: Response, next:NextFunction) {
    try {
        const { email, password, role }  = req.body

        if(!email || !password) {
            throw new AppError("Email and Password are required", 400)
        }

        const result = await AuthServices.login(email, password)
        res.status(201).json({message: "User created successfully", result})
    } catch(err) {
        next(err)
    }
}

export async function currentUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.user?.id)

        const currentUser = await AuthServices.getCurrentUser(id)

        if(!currentUser) {
            throw new AppError("User no longer exists", 404)
        }

        res.json(currentUser)
    } catch(err) {
        next(err)
    }
}

