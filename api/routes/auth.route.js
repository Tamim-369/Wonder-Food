import express from "express";
import {
  forgetPassword,
  resetpassword,
  signin,
  signup,
} from "../controllers/auth.controller.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signup);
router.post("/signin", signin);
router.post("/forgetpassword/:userEmail", forgetPassword);
router.post("/resetpassword/:id", resetpassword);

export default router;
