import multer from "multer";
import Post from "../models/post.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath function
import cloudinary from "../utils/cloudinary.js";
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
    // Multer has successfully uploaded the file
    const { name, description, instructions, ingredients, userEmail } =
      req.body;
    const file = req.file;
    const img = await cloudinary.uploader.upload(file.path, {
      folder: "profilePicture",
    });
    const imgUrl = img.secure_url;

    const newPost = new Post({
      name,
      description,
      instructions,
      ingredients,
      postsPicture: imgUrl,
      userEmail,
    });

    const saved = await newPost.save();

    res.status(201).json(saved);
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

    const { name, description, ingredients, instructions } = req.body;

    // Check if a file was uploaded
    let postsPicture = post.postsPicture;
    if (req.file) {
      const file = req.file;
      const img = await cloudinary.uploader.upload(file.path, {
        folder: "profilePicture",
      });
      postsPicture = img.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { name, description, ingredients, instructions, postsPicture },
      { new: true }
    );

    // Send updated user data
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user data" });
  }
};
