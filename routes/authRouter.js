import express from "express";
import { loginUser, registrUser } from "../controllers/authControler.js";
import { validateContact } from "./middlewareValidate.js";
import { authSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateContact(authSchema), registrUser);
authRouter.post("/login", validateContact(authSchema), loginUser);

export default authRouter;
