import { Router } from "express";
import * as AuthController from "../controller/auth.controller"
import { authenticate } from "../middleware/authenticate";

const authRouter = Router()

authRouter.post("/register", AuthController.register)
authRouter.post("/login", AuthController.login)
authRouter.get("/me", authenticate, AuthController.currentUser)

export default authRouter
