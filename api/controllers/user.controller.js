import User from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Import fileURLToPath function
import checkAndDeleteImages from "../utils/autoDelete.js";
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../profilePicture")); // Destination folder for profile pictures
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalFilename = file.originalname;
    const fileExtension = originalFilename.split(".").pop(); // Get the original file extension
    const newFilename = `${file.originalname}-${uniqueSuffix}.${fileExtension}`; // Append unique suffix and original extension
    cb(null, newFilename); // Use the new filename for profile pictures
  },
});

const upload = multer({ storage }).single("profilePicture"); // Assuming 'profilePicture' is the field name in the form

export const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
      const { name, bio } = req.body;

      // Check if a file was uploaded
      let profilePicture = user.profilePicture;
      if (req.file) {
        profilePicture = req.file.filename;
      }

      // If a new profile picture was uploaded and there's an existing profile picture, delete the old one
      if (req.file && user.profilePicture) {
        const profilePicturePath = path.join(
          __dirname,
          "../profilePicture",
          user.profilePicture
        );
        // Call your function to delete the old profile picture
        deleteProfilePicture(profilePicturePath);
      }

      // Update user data including profile picture
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, bio, profilePicture },
        { new: true }
      );

      // Send updated user data
      res.status(200).json(updatedUser);
    });
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
