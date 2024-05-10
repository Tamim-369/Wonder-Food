import express from "express";
import {
  getUser,
  getUserById,
  updateUser,
  verify,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user/:userEmail", getUser);
router.get("/user/", getUser);
router.get("/userid/:id", getUserById);
router.put("/update/:id", updateUser);
router.put("/verify/:id", verify);

export default router;
