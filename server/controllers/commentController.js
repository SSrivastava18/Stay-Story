const Comment = require("../models/commentModel");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");

module.exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the comments and populate the user field
    const comments = await Comment.find({ review: id }).populate("user", "username");

    // Log to check if user data is being populated
    console.log("Comments with populated user:", comments);

    // Format to send only necessary data with a fallback username if missing
    const formatted = comments.map(comment => ({
      _id: comment._id,
      review: comment.review,
      content: comment.content,
      userId: comment.user ? comment.user._id : null,  // Ensure user exists before accessing _id
      username: comment.user && comment.user.username ? comment.user.username : "Anonymous",  // Fallback username
    }));

    res.json({ success: true, comments: formatted });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const newComment = new Comment({
      review: id,
      user: req.user.id,  // Ensure the user is logged in before posting
      content,
    });

    await newComment.save();

    // Populate the newly added comment to include the username
    const populatedComment = await Comment.findById(newComment._id).populate("user", "username");

    // Log to check the populated user
    console.log("Populated comment with user:", populatedComment);

    res.status(201).json({
      success: true,
      comment: {
        _id: populatedComment._id,
        review: populatedComment.review,
        content: populatedComment.content,
        userId: req.user.id,
        username: populatedComment.user && populatedComment.user.username ? populatedComment.user.username : "Anonymous",  // Fallback if username missing
      },
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.content = req.body.content;
    await comment.save();

    // Return the updated comment with the username (directly from populated comment)
    res.status(200).json({
      success: true,
      message: "Comment updated",
      comment: {
        _id: comment._id,
        review: comment.review,
        content: comment.content,
        userId: comment.user,
        username: comment.user && comment.user.username ? comment.user.username : "Anonymous",  // Fallback if username missing
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
