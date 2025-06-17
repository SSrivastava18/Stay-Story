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
    const allReview = await Review.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .lean();

    const normalizedReviews = allReview.map((review, i) => {
      // ✅ Convert image[] to images[] for frontend
      if (Array.isArray(review.image) && review.image.length > 0) {
        review.images = review.image.map(img => ({
          url: img.url,
          filename: img.filename,
        }));
      } else {
        review.images = [];
      }

      // ✅ Optional: remove original 'image' field
      delete review.image;

      console.log(`#${i + 1} - Flattened image:`, review.images?.[0]?.url);

      return review;
    });

    return res.json({ success: true, data: normalizedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};



// Add a new review
module.exports.addReview = async (req, res) => {
  try {
    const files = Array.isArray(req.files?.images)
      ? req.files.images
      : [req.files?.images].filter(Boolean);

    if (!files.length) {
      return res.status(400).json({ success: false, message: "At least one image is required." });
    }

    const uploadedImages = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      uploadedImages.push({ url: result.secure_url, filename: result.public_id });
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

    const newReview = new Review({
      name: req.body.name.trim(),
      location: req.body.location.trim(),
      reviewText: req.body.reviewText.trim(),
      rating: req.body.rating,
      image: uploadedImages,
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
    res.status(500).json({
      success: false,
      message: "Error occurred while saving the review.",
    });
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

    // ✅ Normalize retained image URLs from the form
    let retainedImages = [];
    if (Array.isArray(req.body.existingImages)) {
      retainedImages = req.body.existingImages;
    } else if (typeof req.body.existingImages === "string") {
      retainedImages = [req.body.existingImages];
    }

    // ✅ Delete removed images from Cloudinary
    const imagesToDelete = review.image.filter(
      (img) => !retainedImages.includes(img.url)
    );
    for (let img of imagesToDelete) {
      await cloudinary.uploader.destroy(img.filename);
    }

    // ✅ Start with retained images
    let updatedImages = review.image.filter((img) =>
      retainedImages.includes(img.url)
    );

    // ✅ Handle newly uploaded files
    const newFiles = Array.isArray(req.files?.images)
      ? req.files.images
      : [req.files?.images].filter(Boolean);

    for (let file of newFiles) {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      updatedImages.push({
        url: result.secure_url,
        filename: result.public_id,
      });
    }

    // ✅ Parse facilities array safely
    const facilities = Array.isArray(req.body["facilities[]"])
      ? req.body["facilities[]"]
      : [req.body["facilities[]"]].filter(Boolean);

    // ✅ Parse nested ratings
    const facilitiesRating = {
      cleanliness: Number(req.body["facilitiesRating[cleanliness]"]) || 0,
      food: Number(req.body["facilitiesRating[food]"]) || 0,
      security: Number(req.body["facilitiesRating[security]"]) || 0,
      internet: Number(req.body["facilitiesRating[internet]"]) || 0,
    };

    // ✅ Construct update payload
    const updatedData = {
      name: req.body.name?.trim(),
      location: req.body.location?.trim(),
      reviewText: req.body.reviewText?.trim(),
      rating: req.body.rating,
      image: updatedImages,
      priceRange: req.body.priceRange,
      roomType: req.body.roomType,
      facilities,
      pgType: req.body.pgType,
      preferredTenant: req.body.preferredTenant,
      facilitiesRating,
    };

    // ✅ Apply update
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.json({ success: true, updatedReview });

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
      .populate("user", "name")
      .lean(); // Make it easier to modify the object

    const totalReviews = await Review.countDocuments(filter);

    const normalizedReviews = reviews.map((review, i) => {
      if (Array.isArray(review.image) && review.image.length > 0) {
        review.images = review.image.map((img) => ({
          url: img.url,
          filename: img.filename,
        }));
      } else {
        review.images = [];
      }

      delete review.image;

      return review;
    });

    res.json({
      success: true,
      reviews: normalizedReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page,
      totalReviews,
    });
  } catch (error) {
    console.error("Error during search:", error.message);
    res.status(500).json({ success: false, message: "Error searching reviews" });
  }
};


module.exports.getSimilarReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const currentReview = await Review.findById(id);

    if (!currentReview) {
      return res.status(404).json({ success: false, message: "Original review not found" });
    }

    // Step 1: Strict match (all attributes + at least one facility)
    let similarReviews = await Review.find({
      _id: { $ne: id },
      location: currentReview.location,
      roomType: currentReview.roomType,
      priceRange: currentReview.priceRange,
      facilities: { $in: currentReview.facilities },
    })
      .populate("user", "name")
      .limit(3)
      .lean();

    // Step 2: If less than 3, fetch fallback matches (any one attribute)
    if (similarReviews.length < 3) {
      const moreReviews = await Review.find({
        _id: { $ne: id },
        $or: [
          { location: currentReview.location },
          { roomType: currentReview.roomType },
          { priceRange: currentReview.priceRange },
          { facilities: { $in: currentReview.facilities } },
        ],
      })
        .populate("user", "name")
        .limit(4 - similarReviews.length)
        .lean();

      // Avoid duplicates
      const existingIds = new Set(similarReviews.map((r) => r._id.toString()));
      for (const r of moreReviews) {
        if (!existingIds.has(r._id.toString())) {
          similarReviews.push(r);
        }
      }
    }

    // Normalize image → images[]
    similarReviews = similarReviews.map((review) => {
      if (Array.isArray(review.image)) {
        review.images = review.image.map((img) => ({
          url: img.url,
          filename: img.filename,
        }));
      } else {
        review.images = [];
      }
      delete review.image;
      return review;
    });

    return res.json({ success: true, similarReviews });
  } catch (err) {
    console.error("Error fetching similar reviews:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports.getMyReviews = async (req, res) => {
  try {
    console.log("before");
    const userId = req.user.id;
    console.log(userId);
    const reviews = await Review.find({ user: userId }).populate("user", "name");
    res.json({ success: true, reviews });
  } catch (err) {
    console.error("Error fetching my reviews:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


