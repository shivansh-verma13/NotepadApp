import express from "express";
import userRoutes from "./userRoutes.js";
import noteRoutes from "./noteRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/notes", noteRoutes);

export default router;
