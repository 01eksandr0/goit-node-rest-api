import express from "express";
import {
  changeAvatars,
  currentUser,
  loginUser,
  logoutUser,
  registrUser,
} from "../controllers/authControler.js";
import { validateContact } from "./middlewareValidate.js";
import { authSchema } from "../schemas/userSchemas.js";
import { authenticate } from "./authenticate.js";
import { upload } from "./upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateContact(authSchema), registrUser);
authRouter.post("/login", validateContact(authSchema), loginUser);
authRouter.get("/current", authenticate, currentUser);
authRouter.post("/logout", authenticate, logoutUser);
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  changeAvatars
);

export default authRouter;
