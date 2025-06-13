import React from "react";
import "./Footer.css";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
    // Function to prevent default link behavior
    const handleFooterContactClick = (e) => {
        e.preventDefault();
        // You can add other functionality here if needed, e.g., open a modal, copy email
        console.log("Contact link in footer clicked! No navigation.");
    };

    return (
        // id="footer" is correct for scrolling from the Nav component
        <footer id="footer" className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <h1 className="footer-title">StayStory</h1>
                    <p className="footer-description">
                        Real hostel & PG reviews from actual students. Find your perfect
                        place with confidence and ease.
                    </p>
                    <div className="footer-social">
                        <a
                            href="https://www.linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="footer-icon" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="footer-icon" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <FaGithub className="footer-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h2 className="footer-heading">Explore</h2>
                    <a className="footer-link" href="/">Home</a>
                    <a className="footer-link" href="/post-review">Add Review</a>
                    <a className="footer-link" href="/about">About Us</a>

                    {/* Change for the "Contact" link within the footer:
                        - Set href to "#"
                        - Add onClick to prevent default navigation
                    */}
                    <a className="footer-link" href="#" onClick={handleFooterContactClick}>
                        Contact
                    </a>
                </div>

                <div className="footer-contact">
                    <h2 className="footer-heading">Get in Touch</h2>
                    <p className="footer-contact-item">+91 98765 43210</p>
                    <p className="footer-contact-item">support@staystory.com</p>
                </div>
            </div>

            <div className="footer-divider"></div>

            <p className="footer-copyright">
                © {new Date().getFullYear()} StayStory. Made with ❤ by students for students.
            </p>
        </footer>
    );
};

export default Footer;