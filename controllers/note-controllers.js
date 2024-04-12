import { UserModel } from "../models/user.js";

export const getUserNotes = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or token expired." });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "User Authorization Failed." });
    }
    const userNotes = user.notes;
    return res.status(200).json({ message: "OK", userNotes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const createUserNote = async (req, res) => {
  try {
    const userID = res.locals.jwtData.id;
    const user = await UserModel.findById(userID);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or token expired" });
    }
    if (user._id.toString() !== userID) {
      return res.status(401).json({ mesaage: "User Authorization Failed" });
    }

    const { title, content } = req.body;
    user.notes.push({ title, content });
    await user.save();

    return res
      .status(201)
      .json({ message: "Created a Note", notes: user.notes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.mesaage });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Does Not Exist or Token Expired" });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "User Authorization Failed" });
    }

    const userNotes = user.notes;
    const userNoteToDeleteID = req.params.noteID;

    let noteFound = false;
    for (let i = 0; i < userNotes.length; i++) {
      const userNote = userNotes[i];
      if (userNote.id.toString() === userNoteToDeleteID) {
        userNotes.splice(i, 1);
        noteFound = true;
        break;
      }
    }

    if (!noteFound) {
      return res.status(400).json({ message: "Note to be deleted not found" });
    }

    await user.save();
    return res.status(200).json({ message: "OK", userNotes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const updateUserNote = async (req, res) => {
  try {
    const userID = res.locals.jwtData.id;
    const user = await UserModel.findById(userID);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Does Not Exist or Token Expired" });
    }
    if (user._id.toString() !== userID) {
      return res.status(401).json({ message: "User Authorization Failed" });
    }
    const { content, noteID } = req.body;
    const userNotes = user.notes;
    let noteFound = false;
    for (let i = 0; i < userNotes.length; i++) {
      const userNote = userNotes[i];
      if (userNote._id.toString() === noteID) {
        userNote.content = content;
        noteFound = true;
        break;
      }
    }

    if (!noteFound) {
      return res.status(400).json({ message: "Note to be updated not found" });
    }

    await user.save();
    return res.status(200).json({ message: "OK", notes: user.notes });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
