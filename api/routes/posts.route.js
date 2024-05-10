import express from "express";
import {
  createPost,
  getPost,
  getPostAndDelete,
  getPostAndUpdate,
  getPostbyEmail,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost/:email", createPost);
router.get("/getpost/:id", getPost);
router.get("/getpostbyemail/:email", getPostbyEmail);
router.get("/getpost/", getPost);
router.delete("/getpost/:id", getPostAndDelete);
router.put("/getpost/:id", getPostAndUpdate);

export default router;
