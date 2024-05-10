import multer from "multer";
import Post from "../models/post.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath function

import checkPostsAndDeleteImages from "../utils/autoDeletePostImg.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./postsPicture";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Get the file extension from the original filename
    const fileExtension = file.originalname.split(".").pop();
    // Append the file extension to the generated filename
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});
const upload = multer({
  storage: storage,
}).single("postsPicture");
const deletePostPicture = (filePath) => {
  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    // Handle error if any
  }
};
export const createPost = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error("Multer error:", err);
        return res.status(500).json({ error: "File upload error" });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error" });
      }
      // Multer has successfully uploaded the file
      const { name, description, instructions, ingredients, userEmail } =
        req.body;
      const postsPicture = req.file ? req.file.filename : null; // Get the filename if file was uploaded

      const newPost = new Post({
        name,
        description,
        instructions,
        ingredients,
        postsPicture,
        userEmail,
      });

      const saved = await newPost.save();

      res.status(201).json(saved);
    });
  } catch (error) {}
};

export const getPost = async (req, res, next) => {
  const postId = req.params.id;
  if (postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    try {
      const post = await Post.find({});
      if (!post) {
        res.status(404).json({ message: "Post not found" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
export const getPostbyEmail = async (req, res, next) => {
  const postEmail = req.params.email;
  try {
    const post = await Post.find({ userEmail: postEmail });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getPostAndDelete = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findByIdAndDelete({ _id: id });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Deleted succesfully" });
  } catch (error) {
    console.log(error);
  }
};
export const getPostAndUpdate = async (req, res, next) => {
  const postId = req.params.id;

  try {
    // Find the user by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Handle file upload using multer middleware
    upload(req, res, async function (err) {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "File upload error" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error" });
      }

      // Extract data from request body
      const { name, description, ingredients, instructions } = req.body;

      // Check if a file was uploaded
      let postsPicture = post.postsPicture;
      if (req.file) {
        postsPicture = req.file.filename;
      }

      // If a new profile picture was uploaded and there's an existing profile picture, delete the old one
      if (req.file && post.postsPicture) {
        const postPicturePath = path.join(
          __dirname,
          "../postsPicture",
          post.postsPicture
        );
        // Call your function to delete the old profile picture
        deletePostPicture(postPicturePath);
      }

      // Update user data including profile picture
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { name, description, ingredients, instructions, postsPicture },
        { new: true }
      );

      // Send updated user data
      res.status(200).json(updatedPost);
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user data" });
  }
};
