import type { Response, Request, NextFunction } from "express"
import * as TodosServices from "../services/todo.services"

export async function getTodos(req: Request, res: Response, next: NextFunction) {
    try {
        const status = req.query.status as TodosServices.Status
        const priority = req.query.priority as TodosServices.Priority

        const allTodos = await TodosServices.getTodos(status, priority)

        if(!allTodos) {
            res.json([])

            return
        }

        res.json(allTodos)
    } catch(err) {
        next(err)
    }
}

export async function createTodos(req: Request, res: Response, next: NextFunction) {
    const validStatuses = ["pending", "completed"]
    const validPriorities = ["low", "medium", "high"]

    try {
        const { title, status, priority, description } = req.body
        

        const requiredFields = ["title", "status", "priority"]
        const missingFields = requiredFields.filter(field => !req.body[field])

        if (missingFields.length > 0) {
            res.status(400).json({error: `missing field: ${missingFields.join(", ")}`})
            return
        }
        if(status && !validStatuses.includes(status)) {
            res.json({error: `${status} is not in the option, for status`})
            return
        }
        if(priority && !validPriorities.includes(priority)) {
            res.json({error: `${priority} is not in the option, for priority`})
            return
        }
        const newTodo = await TodosServices.createTodos(title, status, priority, description)
        res.status(201).json({message: "Todo created successfully", newTodo})
    }
    catch(err) {
        next(err)
    }
}

export async function deleteTodos(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        await TodosServices.deleteTodos(id)

        res.json({message: `Todo with ${id}, deleted successfuly`})
    } catch(err) {
        next(err)
    }
}

export async function getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id)
        const todo = await TodosServices.getTodoById(id)

        if(!todo) {
            res.status(404).json({error: `Todo with ${id}, not found`})
            return
        }
         res.json(todo)
    } catch(err) {
        next(err)
    }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id)
        const toto = await TodosServices.updateTodo(id, req.body)
        console.log(toto)
        // if(!todo) {
        //     res.status(404).json({error: `Todo with ${id}, not found`})
        //     return
        // }
         res.json({message: `Todo with id ${id} updated successfully`})
    } catch(err) {
        next(err)
    }
}