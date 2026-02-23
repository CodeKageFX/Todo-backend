import express, { type Request, type Response, type NextFunction } from "express"
import todoRouter from "./routes/todo.routes.ts"
import { AppError } from "./lib/AppError.ts"
import { logger } from "./middleware/create.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import authRouter from "./routes/auth.routes.ts"

const app = express()

app.use(express.json())
app.use(logger)

app.get("/", (_req, res) => {
    res.json({message: "Server active"})
})

app.use("/auth", authRouter)
app.use("/todos", todoRouter)

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
});

app.use(errorHandler)

export default app