import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    profilePicture: {
      type: String,

      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    bio: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false; // Return false in case of an error
  }
};
const User = mongoose.model("User", userSchema);
export default User;
