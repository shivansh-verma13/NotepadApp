import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  verifyUser,
} from "../controllers/user-controllers.js";
import {
  validate,
  loginValidator,
  registerValidator,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = express.Router();

userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.post("/register", validate(registerValidator), userRegister);
userRoutes.get("/auth", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, userLogout);

export default userRoutes;
