import Comment from "../models/comment.model.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    // Extract data from the request body
    const { postId, userEmail, comment } = req.body;

    // Create a new instance of the Comment model with the extracted data
    const newComment = new Comment({
      postId,
      userEmail,
      comment,
    });

    // Save the new comment to the database
    const savedComment = await newComment.save();

    // Send a success response with the saved comment
    res.status(201).json(savedComment);
  } catch (error) {
    // Handle any errors that occur during the saving process
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing comment
export const updateComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    // Find the comment by ID and update its content
    const updatedComment = await Comment.findByIdAndUpdate(
      postId,
      { comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an existing comment
export const deleteComment = async (req, res) => {
  try {
    const id = req.params.postId;
    // Find the comment by ID and delete it
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get a single comment by ID
export const getComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment by ID
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all comments for a specific post
export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find all comments associated with the given post ID
    const comments = await Comment.find({ postId });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
