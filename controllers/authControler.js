import bcrypt from "bcryptjs";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import { sendMail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarsDir = join(__dirname, "../", "public", "avatars");

export const registrUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(req.body.email);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = {
      to: req.body.email,
      subject: "Verify email",
      html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendMail(verifyEmail);

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
    await image.resize(250, 250).writeAsync(resultUpload);
    await fs.rename(tempPath, resultUpload);
    const avatarURL = `/avatars/${fileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(401, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
};

export const resendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendMail(verifyEmail);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};
