const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      set: (val) => val.trim() 
    },
    location: { 
      type: String, 
      required: true, 
      set: (val) => val.trim() 
    },
    reviewText: { 
      type: String, 
      required: true, 
      set: (val) => val.trim() 
    },
    
    rating: { type: Number, required: true, min: 0, max: 5 },

    image: [
      {
        url: String,
        filename: String,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    priceRange: { type: String },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Shared"],
    },

    facilities: { type: [String], default: [] },

    pgType: {
      type: String,
      enum: ["Male", "Female", "Co-ed"],
    },

    preferredTenant: {
      type: String,
      enum: ["Students", "Working Professionals", "Both"],
    },

    facilitiesRating: {
      cleanliness: { type: Number, min: 0, max: 5 },
      food: { type: Number, min: 0, max: 5 },
      security: { type: Number, min: 0, max: 5 },
      internet: { type: Number, min: 0, max: 5 },
    },
  },
  {
    timestamps: true,
  }
);

// Create a text index on the `name`, `location`, and `reviewText` fields
reviewSchema.index({ name: "text", location: "text", reviewText: "text" });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
