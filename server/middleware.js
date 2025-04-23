const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWTSECRET;

// Ensure JWT secret is defined
if (!jwtSecret) {
  console.error("JWTSECRET is missing in the environment variables.");
  process.exit(1); // Exit the process if secret is not available
}

module.exports.isverified = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded || !decoded.id || typeof decoded.id !== "string") {
      return res.status(403).json({
        success: false,
        message: "Invalid token structure: Missing or invalid user ID",
      });
    }

    req.user = {
      id: decoded.id,
      username: decoded.username || "User", // fallback if username wasn't embedded
      email: decoded.email || "N/A",         // fallback if email wasn't embedded
    };

    console.log(`Token verified for user: ${decoded.id}`);

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
