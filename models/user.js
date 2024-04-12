import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unqiue: true },
  password: { type: String, required: true },
  notes: [noteSchema],
});

export const UserModel = mongoose.model("user", userSchema);
