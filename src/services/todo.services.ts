import prisma from "../lib/prisma";
import { Prisma, PrismaClient, StatusEnum, PriorityEnum } from "@prisma/client";
import { AppError } from "../lib/AppError";

export type Status = "pending" | "inProgress" | "completed"
export type Priority = "low" | "medium" | "high"

export type Todo = Prisma.TodoGetPayload<{}>

export async function getTodos(
    userId: number,
    status?: Status,
    priority?: Priority,
    page: number = 1,
    limit: number = 10
) {
    const where: Prisma.TodoWhereInput = {
        userId // ← always filter by user
    }

    if (status) where.status = status as StatusEnum
    if (priority) where.priority = priority as PriorityEnum

    const [todos, total] = await Promise.all([
        prisma.todo.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: ( page - 1 ) * limit,
            take: limit
        }),

        prisma.todo.count({ where })
    ])

    return {
        todos,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    }
}

export async function createTodos(
    userId: number,
    data: {
        title: string,
        status: Status,
        priority: Priority,
        description?: string,
        dueDate?: string
    }
): Promise<Todo> {
    return await prisma.todo.create({
        data: {
            title: data.title,
            status: data.status ?? "pending",
            priority: data.priority ?? "medium",
            description: data.description,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            userId
        }
    });
}

// Delete todo — make sure it belongs to this user
export async function deleteTodo(id: number, userId: number) {
    const todo = await prisma.todo.findUnique({ where: { id } })

    if (!todo) throw new Error("Todo not found")
    if (todo.userId !== userId) throw new Error("Unauthorized")

    return prisma.todo.delete({ where: { id } })
}

export async function getTodoById(id:number, userId: number): Promise<Todo | null> {
    const todo = await prisma.todo.findUnique({ where: {id} })

    if(!todo) throw new Error("Todo not found")
    if(todo.userId !== userId) throw new Error("Unauthorized")

    return todo
}

// Update todo — make sure it belongs to this user
export async function updateTodo(
    id: number,
    userId: number,
    data: Partial<{
        title: string
        description: string
        status: StatusEnum
        priority: PriorityEnum
        dueDate: string
        order: number
    }>
) {
    const todo = await prisma.todo.findUnique({ where: { id } })

    if (!todo) throw new Error("Todo not found")
    if (todo.userId !== userId) throw new Error("Unauthorized")

    return prisma.todo.update({
        where: { id },
        data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        }
    })
}