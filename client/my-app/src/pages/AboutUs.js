import React from "react";
import "./AboutUs.css";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const AboutUs = () => {
	return (
		<div className="about-wrapper">
			<div className="about-container">
				<h1 className="title">About StayStory</h1>
				<p className="tagline">
					Find Your Perfect Stay—Rated by Students, for Students.
				</p>

				<section className="about-section">
					<h2>Our Mission</h2>
					<p>
						At <strong>StayStory</strong>, our mission is to redefine how
						students find their second home. We are driven by a deep passion to
						empower students with trustworthy insights, enabling them to make
						confident, informed choices when relocating to unfamiliar cities.
						Every review on our platform is shared by real students who’ve lived
						the experience—ensuring honesty, transparency, and community-driven
						trust in every stay.
					</p>
				</section>

				<section className="about-section">
					<h2>Our Vision</h2>
					<p>
						At <strong>StayStory</strong>, we envision a future where every
						student can find their ideal accommodation with confidence and
						clarity. Our goal is to eliminate uncertainty by building a trusted,
						student-first platform where honest experiences replace exaggerated
						advertisements. We aspire to become India's most reliable and
						empowering destination for student housing insights—driven by real
						voices and real stories.
					</p>
				</section>

				<section className="about-section">
					<h2>What We Do</h2>
					<ul>
						<li>
							Provide a trusted platform where students can share candid reviews
							and experiences about their PGs and hostels.
						</li>
						<li>
							Empower new and relocating students to make confident
							accommodation choices through authentic, peer-driven insights.
						</li>
						<li>
							Champion transparency and accountability in the student housing
							ecosystem by highlighting both strengths and shortcomings.
						</li>
						<li>
							Foster a supportive community that enables students to connect,
							engage, and collaborate over shared living experiences.
						</li>
					</ul>
				</section>

				<section className="about-section">
					<h2>Meet the Team</h2>
					<p>
						<strong>Saurabh Srivastava</strong> – Co-Founder, Full-Stack Developer
					</p>
					<p>
						<strong>Raushan Gupta</strong> – Co-Founder, Full-Stack Developer
					</p>
					<p>
						We are passionate Computer Science students dedicated to leveraging
						technology to solve real-world problems. Having personally
						experienced the challenges and uncertainties involved in finding
						safe and affordable student housing, we founded <strong>StayStory</strong> to create a
						transparent and reliable platform.
					</p>
					<p>
						Through StayStory, we aim to foster a supportive community that
						bridges the gap between students and trustworthy housing options.
					</p>
				</section>

				<section className="about-section">
					<h2>Contact Us</h2>

					<p>
						<strong>Raushan Gupta</strong> – Co-Founder
						<br />
						<strong>Email:</strong>{" "}
						<a href="mailto:work.raushangupta@gmail.com">
							work.raushangupta@gmail.com
						</a>
						<br />
						<strong>LinkedIn:</strong>{" "}
						<a href="https://www.linkedin.com/in/raushangupta16/" target="_blank" rel="noopener noreferrer">
							<FaLinkedin /> linkedin.com/in/raushangupta
						</a>
						<br />
						<strong>GitHub:</strong>{" "}
						<a href="https://github.com/RaushanGupta1516" target="_blank" rel="noopener noreferrer">
							<FaGithub /> github.com/raushangupta
						</a>
						<br />
						<strong>Twitter:</strong>{" "}
						<a href="https://x.com/RaushanGupta_16" target="_blank" rel="noopener noreferrer">
							<FaTwitter /> twitter.com/raushangupta
						</a>
					</p>

					<p>
						<strong>Saurabh Srivastava</strong> – Co-Founder
						<br />
						<strong>Email:</strong>{" "}
						<a href="mailto:srivas20saurabh@gmail.com">
							srivas20saurabh@gmail.com
						</a>
						<br />
						<strong>LinkedIn:</strong>{" "}
						<a href="https://www.linkedin.com/in/saurabh-srivastava-5594862b8/" target="_blank" rel="noopener noreferrer">
							<FaLinkedin /> linkedin.com/in/saurabh
						</a>
						<br />
						<strong>GitHub:</strong>{" "}
						<a href="https://github.com/SSrivastava18" target="_blank" rel="noopener noreferrer">
							<FaGithub /> github.com/saurabh
						</a>
						<br />
						<strong>Twitter:</strong>{" "}
						<a href="https://x.com/Saurabh21937494" target="_blank" rel="noopener noreferrer">
							<FaTwitter /> twitter.com/saurabh
						</a>
					</p>
				</section>

				<div className="cta-section">
					<a href="/" className="cta-link">
						Read Reviews
					</a>
					<Link to="/post-review" className="cta-link">
						Post Review
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AboutUs;
