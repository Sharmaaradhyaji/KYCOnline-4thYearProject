import { Router } from "express";
import { body } from "express-validator";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post(
  "/register",
  [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullname.firstname").isLength({ min: 3 })
  ],
  registerUser
);

userRouter.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  loginUser
);

userRouter.post(
  '/logout', logoutUser
)

export default userRouter;
