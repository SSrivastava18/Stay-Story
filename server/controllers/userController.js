const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWTSECRET,
    { expiresIn: "1d" }
  );
};

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // ✅ Required field check
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // ✅ Restrict to only Gmail addresses
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ success: false, message: "Only Gmail addresses are allowed" });
    }

    // ✅ Validate password strength
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    // ✅ Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("Signup error:", error);
    return res.status(500).json({ success: false, message: "An error occurred during signup" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, userExist.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }

    const token = createToken(userExist);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ success: false, message: "An error occurred during login" });
  }
};

module.exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "",
        googleId,
      });
      await user.save();
    }

    const authToken = createToken(user);
    res.status(200).json({ success: true, token: authToken });
  } catch (err) {
    console.error("Google login error", err);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};
