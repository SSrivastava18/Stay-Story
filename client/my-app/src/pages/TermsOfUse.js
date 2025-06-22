import React from "react";
import "./AboutUs.css"; // Reusing the same styling
import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <div className="about-wrapper">
      <div className="about-container">
        <h1 className="title">Terms of Use & Privacy Policy</h1>
        <p className="tagline">Your trust matters. Here’s how we protect it.</p>

        <section className="about-section">
          <h2>Terms of Use</h2>
          <p>
            By accessing and using <strong>StayStory</strong>, you acknowledge and agree to comply with the following terms and conditions. If you do not agree with any of these terms, please refrain from using our platform.
          </p>
          <ul>
            <li>Users are expected to provide honest, accurate, and respectful reviews based on real experiences.</li>
            <li>Content that is abusive, misleading, or false is strictly prohibited and may be removed at our discretion.</li>
            <li><strong>StayStory</strong> reserves the right to edit, moderate, or delete content that violates our community standards or these terms.</li>
            <li>By posting reviews or submitting content, users grant <strong>StayStory</strong> the right to display, manage, and use such content on our platform.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Privacy Policy</h2>
          <p>
            At <strong>StayStory</strong>, your privacy is our top priority. We are committed to protecting your personal data and ensuring a secure experience on our platform.
          </p>
          <ul>
            <li>Your email address and profile information are used only for authentication, account management, and essential communication.</li>
            <li>All user data is stored securely, with access restricted to authorized personnel only.</li>
            <li>We use cookies to enhance user experience, monitor performance, and improve our services.</li>
            <li>You may request the removal of your account or data at any time by contacting our support team.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contact & Support</h2>
          <p>
            For any questions regarding our terms, privacy practices, or to report misuse or content violations, please feel free to reach out:
            <br />
            📧 <strong>Email:</strong>{" "}
            <a href="mailto:staystoryweb@gmail.com">staystoryweb@gmail.com</a>
          </p>
        </section>

        <div className="cta-section">
          <Link to="/" className="cta-link">Go to Home</Link>
          <Link to="/post-review" className="cta-link">Post a Review</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;