
const express = require("express");
const router = express.Router({ mergeParams: true });
const { isverified } = require("../middleware");
const commentController = require("../controllers/commentController");

router.get("/", commentController.getComments);
router.post("/", isverified, commentController.addComment);
router.put("/:commentId", isverified, commentController.updateComment);
router.delete("/:commentId", isverified, commentController.deleteComment);
module.exports = router;

