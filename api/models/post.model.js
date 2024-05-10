import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    postsPicture: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
