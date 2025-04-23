const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// Get all reviews
module.exports.getReviewData = async (req, res) => {
  try {
    const allReview = await Review.find({}).populate("user", "name");
    res.json({ success: true, data: allReview });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

// Add a new review
module.exports.addReview = async (req, res) => {
  try {
    const file = req.files?.image;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }

    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);

    const facilities = Array.isArray(req.body["facilities[]"])
      ? req.body["facilities[]"]
      : [req.body["facilities[]"]].filter(Boolean);

    const facilitiesRating = {
      cleanliness: Number(req.body["facilitiesRating[cleanliness]"]) || 0,
      food: Number(req.body["facilitiesRating[food]"]) || 0,
      security: Number(req.body["facilitiesRating[security]"]) || 0,
      internet: Number(req.body["facilitiesRating[internet]"]) || 0,
    };

    const newReview = new Review({
      name: req.body.name.trim(),
      location: req.body.location.trim(),
      reviewText: req.body.reviewText.trim(),
      rating: req.body.rating,
      image: [
        {
          url: uploadResult.secure_url,
          filename: uploadResult.public_id,
        },
      ],
      user: req.user.id,
      priceRange: req.body.priceRange,
      roomType: req.body.roomType,
      facilities,
      pgType: req.body.pgType,
      preferredTenant: req.body.preferredTenant,
      facilitiesRating,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    let message = "Error occurred while saving the review.";
    if (error.name === "ValidationError") {
      message = Object.values(error.errors).map((err) => err.message).join(", ");
    }
    res.status(500).json({ success: false, message });
  }
};

// Get a single review
module.exports.showReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Error fetching review details", error });
  }
};

// Delete review
module.exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update review
module.exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let imageData = review.image;

    if (req.files?.image) {
      const file = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath);
      imageData = [
        {
          url: uploadResult.secure_url,
          filename: uploadResult.public_id,
        },
      ];
    }

    const facilities = Array.isArray(req.body["facilities[]"])
      ? req.body["facilities[]"]
      : [req.body["facilities[]"]].filter(Boolean);

    const facilitiesRating = {
      cleanliness: Number(req.body["facilitiesRating[cleanliness]"]) || 0,
      food: Number(req.body["facilitiesRating[food]"]) || 0,
      security: Number(req.body["facilitiesRating[security]"]) || 0,
      internet: Number(req.body["facilitiesRating[internet]"]) || 0,
    };

    const updatedData = {
      name: req.body.name.trim(),
      location: req.body.location.trim(),
      reviewText: req.body.reviewText.trim(),
      rating: req.body.rating,
      image: imageData,
      priceRange: req.body.priceRange,
      roomType: req.body.roomType,
      facilities,
      pgType: req.body.pgType,
      preferredTenant: req.body.preferredTenant,
      facilitiesRating,
    };

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json({ success: true, updatedReview });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error occurred" });
  }
};

// Like or unlike a review
module.exports.likeReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not logged in" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const alreadyLiked = review.likes.includes(userId);

    if (alreadyLiked) {
      review.likes.pull(userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyLiked ? "Review unliked" : "Review liked",
      liked: !alreadyLiked,
      totalLikes: review.likes.length,
    });
  } catch (error) {
    console.error("Error in likeReview:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Upload more images
module.exports.uploadImages = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const uploadedImages = [];
    const files = Array.isArray(req.files?.images) ? req.files.images : [req.files?.images];

    for (let file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      uploadedImages.push({ url: result.secure_url, filename: result.public_id });
    }

    if (!Array.isArray(review.image)) {
      review.image = [review.image];
    }

    review.image.push(...uploadedImages);
    await review.save();

    res.json({ success: true, message: "Images uploaded successfully", images: review.image });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Error uploading images" });
  }
};

// Search reviews
module.exports.searchReviews = async (req, res) => {
  try {
    const { q, query, rating } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const normalizedQuery = (query || q || "").trim();

    let filter = {};

    if (normalizedQuery) {
      const regex = new RegExp(normalizedQuery, "i");
      filter.$or = [
        { name: { $regex: regex } },
        { location: { $regex: regex } },
        { reviewText: { $regex: regex } },
      ];
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    console.log("Search Filter:", filter);

    const skip = (page - 1) * limit;
    const reviews = await Review.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("user", "name");

    const totalReviews = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
      totalReviews,
    });
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).json({ success: false, message: "Error searching reviews" });
  }
};
