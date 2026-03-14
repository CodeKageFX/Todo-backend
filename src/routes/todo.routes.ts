import { Router } from "express";
import * as TodosController from "../controller/todo.controller"
import { authenticate, authorizeRoles } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { CreateTodoSchema, UpdateTodoSchema } from "../validators/todo.validators";

const todoRouter = Router()

todoRouter.use(authenticate)

// ✅ Specific first, dynamic last
todoRouter.get("/", TodosController.getTodos)
todoRouter.get("/:id", TodosController.getTodoById)

todoRouter.post("/", validate(CreateTodoSchema),TodosController.createTodos)
todoRouter.patch("/:id", validate(UpdateTodoSchema), TodosController.updateTodo)

todoRouter.delete("/:id", authenticate, authorizeRoles("user"),TodosController.deleteTodos)

export default todoRouter