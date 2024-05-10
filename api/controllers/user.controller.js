import User from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Import fileURLToPath function
import checkAndDeleteImages from "../utils/autoDelete.js";
import cloudinary from "../utils/cloudinary.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname

const deleteProfilePicture = (filePath) => {
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

export const getUser = async (req, res, next) => {
  const userEmail = req.params.userEmail;
  if (userEmail) {
    try {
      const userInfo = await User.findOne({ email: userEmail }); // Find user by email
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" }); // User not found
      }
      res.status(200).json(userInfo); // User found, send user info
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" }); // Server error
    }
  } else {
    try {
      const userInfo = await User.find({}); // Find user by email
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" }); // User not found
      }
      res.status(200).json(userInfo); // User found, send user info
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" }); // Server error
    }
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle file upload using multer middleware

    // Extract data from request body
    const { name, bio } = req.body;
    if (req.file) {
      const file = req.file;
      const img = await cloudinary.uploader.upload(file.path, {
        folder: "profilePicture",
      });
      const profilePicture = img.secure_url;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio, profilePicture },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      const profilePicture = user.profilePicture;
      // Update user data including profile picture
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio, profilePicture },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }

    // Update user data including profile picture

    // Send updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating user data" });
  }
};

export const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(501).json({ message: "Internel server error" });
  }
};

export const verify = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and update the 'verified' field to true
    const user = await User.findByIdAndUpdate(
      userId,
      { verified: true },
      { new: true }
    );

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a success response if the user was updated successfully
    res.status(200).json({ message: "User verified successfully", user });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
