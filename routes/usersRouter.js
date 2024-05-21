import express from "express";
import validateBody from "../helpers/validateBody.js";
import UsersControllers from "../controllers/usersController.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import uploadMiddleware from "../middlewares/upload.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  UsersControllers.register
);

usersRouter.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  UsersControllers.login
);

usersRouter.post(
  "/logout",
  jsonParser,
  authMiddleware.auth,
  UsersControllers.logout
);

usersRouter.get(
  "/current",
  jsonParser,
  authMiddleware.auth,
  UsersControllers.currentUser
);

usersRouter.patch(
  "/",
  jsonParser,
  authMiddleware.auth,
  UsersControllers.updateSubscription
);

usersRouter.patch(
  "/avatars",
  uploadMiddleware.single("Avatar"),
  authMiddleware.auth,
  UsersControllers.updateAvatar
);

export default usersRouter;
