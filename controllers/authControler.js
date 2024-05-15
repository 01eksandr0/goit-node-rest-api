import bcrypt from "bcryptjs";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Jimp from "jimp";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarsDir = join(__dirname, "../", "public", "avatars");

export const registrUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(req.body.email);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: req.body.subscription || "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

export const changeAvatars = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, "File is missing");
    }
    const { _id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const fileName = `${_id}${originalname}`;
    const resultUpload = join(avatarsDir, fileName);
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).write(resultUpload);
    await fs.rename(tempPath, resultUpload);
    const avatarURL = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
