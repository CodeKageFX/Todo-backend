import { Router } from "express";
import * as TodosController from "../controller/todo.controller.ts"
import { authenticate, authorizeRoles } from "../middleware/authenticate.ts";


const todoRouter = Router()

// ✅ Specific first, dynamic last
todoRouter.get("/", TodosController.getTodos)
todoRouter.get("/:id", TodosController.getTodoById)

todoRouter.post("/", authenticate,TodosController.createTodos)
todoRouter.patch("/:id", authenticate, TodosController.updateTodo)

todoRouter.delete("/:id", authenticate, authorizeRoles("admin"),TodosController.deleteTodos)

export default todoRouter