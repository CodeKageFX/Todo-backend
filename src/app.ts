import express, { type Request, type Response, type NextFunction } from "express"
import todoRouter from "./routes/todo.routes"
import { AppError } from "./lib/AppError"
import { logger } from "./middleware/create"
import { errorHandler } from "./middleware/errorHandler"
import authRouter from "./routes/auth.routes"
import { authLimiter, apiLimiter } from "./middleware/rateLimit"
import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

app.use(express.json())
app.use(logger)

app.use("/api", apiLimiter)
app.use("/auth", authLimiter)

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