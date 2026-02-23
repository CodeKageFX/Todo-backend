import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.ts";
import { AppError } from "../lib/AppError.ts";

export type UserRole = "user" | "admin"
export interface TokenPayload {
    id: number
    email: string
    role: UserRole
}

function generateToken(payload: TokenPayload): string {
    const secret = process.env.JWT_SECRET!
    const expiresIn: any = process.env.JWT_EXPIRES_IN || "7d"

    return jwt.sign(payload, secret, { expiresIn })
}

export async function register(email: string, password: string, role: UserRole) {
    const existingEmail = await prisma.user.findUnique({
        where: {email}
    })
    if(existingEmail) {
        throw new AppError("Email already existed", 409)
    }

    const hashPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashPassword,
            role
        }
    })
    const token = generateToken({id: user.id, email: user.email, role: user.role})

    return {
        token,
        user: { id: user.id, email: user.email, role: user.role }
    }
}

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {email}
    })
    if (!user) {
        throw new AppError("Invalid email or password", 401)
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch) {
        throw new AppError("Invalid email or password", 401)
    }

    const token = generateToken({id: user.id, email: user.email, role: user.role})

    return {
        token,
        user: { id: user.id, email: user.email, role: user.role }
    }
}

export function verifyToken(token: string): TokenPayload {
    try {
        const secret = process.env.JWT_SECRET!

        return jwt.verify(token, secret) as TokenPayload
    } catch {
        throw new AppError("Invalid or expired token", 401)
    }
}

export async function getCurrentUser(id: number) {
    return await prisma.user.findUnique({
        where: {id},
        select: {id: true, email: true, role: true, createdAt: true}
    })
}