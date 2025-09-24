import { Router } from "express";
import { checkAuth, dashboard, userLogin } from "../controller/user.controller";
import { authenticateUser } from "../middleware/user.auth";

export const userRouter = Router();

userRouter.post("/login", userLogin);
userRouter.get("/currentUser", authenticateUser, checkAuth);
userRouter.get("/dashboard", authenticateUser, dashboard);
