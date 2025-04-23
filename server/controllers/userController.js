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
  );
};

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 4) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser); 
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred during signup" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const match = await bcrypt.compare(password, userExist.password);
    if (!match) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = createToken(userExist); 
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred during login" });
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
    res.json({ success: true, token: authToken });
  } catch (err) {
    console.error("Google login error", err);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
};

