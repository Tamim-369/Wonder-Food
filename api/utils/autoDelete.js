import fs from "fs/promises";
import path from "path";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const checkAndDeleteImages = async (folderPath) => {
  try {
    // Step 1: Read the folder to get the list of image names
    const files = await fs.readdir(folderPath);
    const imageNames = files.filter(
      (file) =>
        file.endsWith(".jpg") ||
        file.endsWith(".png") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".webp")
    );

    // Step 2: Query the database to check if each image name exists in any user's data
    for (const imageName of imageNames) {
      const usersWithImage = await User.find({ profilePicture: imageName });

      // Step 3: If the image name doesn't exist in any user's data, delete the image
      if (usersWithImage.length === 0) {
        const imagePath = path.join(folderPath, imageName);
        await fs.unlink(imagePath);
        console.log(`Deleted image: ${imageName}`);
      }
    }

    console.log("Image check and deletion completed.");
  } catch (error) {
    console.error("Error during image check and deletion:", error);
  }
};

export default checkAndDeleteImages;
