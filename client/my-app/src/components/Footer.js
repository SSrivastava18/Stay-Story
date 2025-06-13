import React from "react";
import "./Footer.css";

const Footer = () => {
	return (
		<footer id="contact" className="footer-container">
			<div className="footer-content">
				<div className="footer-brand">
					<h1 className="footer-title">StayStory</h1>
					<p className="footer-description">
						Real hostel & PG reviews from actual students. Find your perfect
						place with confidence and ease.
					</p>
					<div className="footer-social">
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="footer-icon" src="linkedin.png" alt="Linkedin" />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="footer-icon" src="twiter.png" alt="Twitter" />
						</a>
						<a
							href="https://github.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img className="footer-icon" src="git.png" alt="git" />
						</a>
					</div>
				</div>

				<div className="footer-links">
					<h2 className="footer-heading">Explore</h2>
					<a className="footer-link" href="/">
						Home
					</a>
					<a className="footer-link" href="/post-review">
						Add Review
					</a>
					<a className="footer-link" href="/about">
						About Us
					</a>
					<a className="footer-link" href="/contact">
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
				© {new Date().getFullYear()} StayStory. Made with ❤ by students for
				students.
			</p>
		</footer>
	);
};

export default Footer;