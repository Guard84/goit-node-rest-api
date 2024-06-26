import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import jimp from "jimp";
import * as fs from "node:fs/promises";
import path from "node:path";

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    const result = await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarURL: result.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
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

const logout = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { token: null });

    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    return res.status(400).send({ message: "Invalid subscription type" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res.status(200).send({
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Choose file" });
  }
  try {
    const image = await jimp.read(req.file.path);
    image.resize(250, 250);
    await image.writeAsync(req.file.path);

    const avatarFilename = `${req.user.id}-${req.file.filename}`;
    const avatarPath = path.resolve("public/avatars", avatarFilename);

    await fs.rename(req.file.path, avatarPath);

    const avatarURL = `/avatars/${avatarFilename}`;
    const userAvatar = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    res.status(200).send({ avatarURL: userAvatar.avatarURL });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  currentUser,
  updateSubscription,
  uploadAvatar,
};
