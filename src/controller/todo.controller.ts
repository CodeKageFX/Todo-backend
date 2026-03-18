import type { Response, Request, NextFunction } from "express"
import * as TodosServices from "../services/todo.services"

export async function getTodos(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id // ← from JWT token via middleware
        const { status, priority, page, limit } = req.query

       const results = await TodosServices.getTodos(
            userId,
            status as TodosServices.Status,
            priority as TodosServices.Priority,
            page ? parseInt(page as string): 1,
            limit ? parseInt(limit as string) : 10
       )

       res.json({
            message: "Todos fetched",
            result: results.todos,
            pagination: results.pagination
       })
    } catch(err) {
        next(err)
    }
}

export async function createTodos(req: Request, res: Response, next: NextFunction) {

    try {
        const userId = req.user!.id
        const todo = await TodosServices.createTodos(userId, req.body)

        res.status(201).json({message: "Todo created successfully", result: todo})
    }
    catch(err) {
        next(err)
    }
}

export async function deleteTodos(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id
        const id = Number(req.params.id)
        await TodosServices.deleteTodo(id, userId)
        res.json({ message: "Todo deleted" })
    } catch(err) {
        next(err)
    }
}

export async function getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id
        const id = Number(req.params.id)
        const todo = await TodosServices.getTodoById(id, userId)

        res.json({message: "Todo fetched", result: todo})
    } catch(err) {
        next(err)
    }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id
        const id = Number(req.params.id)
        const todo = await TodosServices.updateTodo(id, userId, req.body)
        res.json({ message: "Todo updated", result: todo })
    } catch (error) {
        next(error)
    }
}