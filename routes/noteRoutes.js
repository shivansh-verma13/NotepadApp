import express from "express";
import {
  createUserNote,
  deleteNote,
  getUserNotes,
  updateUserNote,
} from "../controllers/note-controllers.js";
import { verifyToken } from "../utils/token-manager.js";

const noteRoutes = express.Router();

noteRoutes.get("/all-notes", verifyToken, getUserNotes);
noteRoutes.post("/newNote", verifyToken, createUserNote);
noteRoutes.delete("/deleteNote/:noteID", verifyToken, deleteNote);
noteRoutes.patch("/updateNote", verifyToken, updateUserNote);

export default noteRoutes;
