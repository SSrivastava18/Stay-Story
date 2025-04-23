const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isverified } = require("../middleware"); 
const User = require("../models/userModel"); 

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/google-login", userController.googleLogin);

router.get("/profile", isverified, async (req, res) => {
	try {
		const user = await User.findById(req.body.userid).select("-password"); 
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.json({ success: true, user });
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ success: false, message: "Error fetching user profile" });
	}
});

module.exports = router;
