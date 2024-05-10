import express from "express";
import {
  createComment,
  deleteComment,
  getComment,
  getCommentsForPost,
  updateComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/get", getComment);
router.get("/get/:postId", getCommentsForPost);
router.post("/create", createComment);
router.put("/update/:postId", updateComment);
router.delete("/delete/:postId", deleteComment);

export default router;
