const express = require("express");
const router = express.Router({ mergeParams: true });
const { isverified } = require("../middleware");
const reviewController = require("../controllers/reviewController");

// Get all reviews
router.get("/", reviewController.getReviewData);

// Search before :id to avoid conflict
router.get("/search", reviewController.searchReviews);

// My reviews route (Moved ABOVE /:id)
router.get("/my-reviews", isverified, reviewController.getMyReviews);

// Like and image upload
router.post("/like/:id", isverified, reviewController.likeReview);
router.put("/upload-images/:id", isverified, reviewController.uploadImages);

// Create review
router.post("/", isverified, reviewController.addReview);

// Single review operations (Should come after all specific routes)
router.get("/:id", reviewController.showReview);
router.delete("/:id", isverified, reviewController.deleteReview);
router.put("/:id", isverified, reviewController.updateReview);

// Similar reviews
router.get("/:id/similar", reviewController.getSimilarReviews);

module.exports = router;