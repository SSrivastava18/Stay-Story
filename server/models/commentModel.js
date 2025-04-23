const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
