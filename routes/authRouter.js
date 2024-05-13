import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registrUser,
} from "../controllers/authControler.js";
import { validateContact } from "./middlewareValidate.js";
import { authSchema } from "../schemas/userSchemas.js";
import { authenticate } from "./authenticate.js";

const authRouter = express.Router();

authRouter.post("/register", validateContact(authSchema), registrUser);
authRouter.post("/login", validateContact(authSchema), loginUser);
authRouter.get("/current", authenticate, currentUser);
authRouter.post("/logout", authenticate, logoutUser);

export default authRouter;
