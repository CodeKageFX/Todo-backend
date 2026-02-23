import prisma from "../lib/prisma.ts";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/AppError.ts";

export type Status = "pending" | "completed"
export type Priority = "low" | "medium" | "high"

export type Todo = Prisma.TodoGetPayload<{}>

export async function getTodos(status?: Status, priority?: Priority): Promise<Todo[]> {
    return await prisma.todo.findMany({
        where: {
            ...( status !== undefined && {status}),
            ...(priority !== undefined && {priority})
        }
    })
}

export async function createTodos(
    title: string,
    status: Status,
    priority: Priority,
    description?: string,
): Promise<Todo> {
        return await prisma.todo.create({
            data: {
                title,
                status,
                priority,
                ...(description !== undefined && { description } )
            }
        })
    
}

export async function deleteTodos(id:number):Promise<void> {
    try {
        await prisma.todo.delete({
            where: {id}
        })
    } catch {
        throw new AppError(`Todo with id ${id} not found`, 404)
    }
}

export async function getTodoById(id:number): Promise<Todo | null> {
    return await prisma.todo.findUnique({
        where: {id}
    })
}

export async function updateTodo(id: number, updates: Partial<Todo>): Promise<void> {
    try {
        await prisma.todo.update({
            where: {id},
            data: updates
        })
    } catch(err) {
        throw new AppError(`Todo with id ${id} not found`, 404)
    }
}