import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middlewares/validateRequest.js";

export const authRouter = Router();

authRouter.post("/register", registerValidator, validateRequest, register);
authRouter.post("/login", loginValidator, validateRequest, login);
