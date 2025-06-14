const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
   googleId: {
    type: String,
    unique: true, // If you intend it to be unique when present
    sparse: true, // Add this
    default: null,
},
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;