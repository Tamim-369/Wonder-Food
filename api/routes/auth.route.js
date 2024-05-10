import express from "express";
import {
  forgetPassword,
  resetpassword,
  signin,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgetpassword/:userEmail", forgetPassword);
router.post("/resetpassword/:id", resetpassword);

export default router;
