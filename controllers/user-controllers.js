import { compare, hash } from "bcrypt";
import { UserModel } from "../models/user.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { createToken } from "../utils/token-manager.js";

export const userRegister = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exits!" });
    }
    const hashedPassword = await hash(password, 10);
    const user = new UserModel({ name, username, password: hashedPassword });
    await user.save();

    res.clearCookie("notepad-token", {
      httpOnly: true,
      domain: "netlify.app",
      signed: true,
      secure: true,
    });

    const token = createToken(username, user._id.toString(), "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie("notepad-token", token, {
      httpOnly: true,
      signed: true,
      domain: "netlify.app",
      sameSite: "none",
      secure: true,
      expires,
    });

    return res
      .status(201)
      .json({ message: "Created User", userName: user.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isPasswordCorrect = await compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ message: "Incorrect Password or Username" });
    }

    res.clearCookie("notepad-token", {
      httpOnly: true,
      signed: true,
      domain: "netlify.app",
      path: "/",
      secure: true,
    });

    const token = createToken(username, existingUser._id.toString(), "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie("notepad-token", token, {
      httpOnly: true,
      signed: true,
      expires,
      domain: "netlify.app",
      path: "/",
      secure: true,
    });

    return res
      .status(200)
      .json({ message: "User Logged In!", name: existingUser.name });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error", cause: error.message });
  }
};

export const verifyUser = async (req, res) => {
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
    return res.status(200).json({ message: "Authorized", name: user.name });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to verify user", cause: error.message });
  }
};

export const userLogout = async (req, res) => {
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

    res.clearCookie("notepad-token", {
      httpOnly: true,
      signed: true,
      path: "/",
      domain: "netlify.app",
      secure: true,
    });

    return res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};
