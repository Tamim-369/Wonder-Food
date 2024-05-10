import express from "express";
import {
  createPost,
  getPost,
  getPostAndDelete,
  getPostAndUpdate,
  getPostbyEmail,
} from "../controllers/post.controller.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.post("/createPost/:email", upload.single("postsPicture"), createPost);
router.get("/getpost/:id", getPost);
router.get("/getpostbyemail/:email", getPostbyEmail);
router.get("/getpost/", getPost);
router.delete("/getpost/:id", getPostAndDelete);
router.put("/getpost/:id", upload.single("postsPicture"), getPostAndUpdate);

export default router;
