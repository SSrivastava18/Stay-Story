import "./Footer.css";
import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../StoreContext";


const Footer = () => {
    const { token } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleFooterContactClick = (e) => {
        e.preventDefault();
        console.log("Contact link in footer clicked! No navigation.");
    };

    const handlePostReviewClick = (e) => {
    e.preventDefault();
    if (token) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/post-review");
    } else {
        alert("Please login first to post a review.");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
};


    return (
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
                            href="https://www.linkedin.com/in/stay-story-416730370/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="footer-icon" />
                        </a>
                        <a
                            href="https://x.com/staystoryweb"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="footer-icon" />
                        </a>
                        <a
                            href="https://www.instagram.com/stor_ystay?igsh=eTE1NTJsN2t0MHFj"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="footer-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h2 className="footer-heading">Explore</h2>
                    <a className="footer-link" href="/">Home</a>
                    <a className="footer-link" href="#" onClick={handlePostReviewClick}>Add Review</a>
                    <a className="footer-link" href="/about">About Us</a>
                    <a className="footer-link" href="#" onClick={handleFooterContactClick}>Contact</a>
                </div>

                <div className="footer-contact">
                    <h2 className="footer-heading">Get in Touch</h2>
                    <p className="footer-contact-item">staystoryweb@gmail.com</p>
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
