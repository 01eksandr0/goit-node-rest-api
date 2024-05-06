import bcrypt from "bcryptjs";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";

export const registrUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: req.body.subscription || "starter",
      },
    });
  } catch (error) {
    res.status(409).json({ message: "Email in use" });
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
    res.json({ status: passwordCompare });
  } catch (error) {
    res.status(409).json({ message: "Email or password is wrong" });
    next(error);
  }
};
