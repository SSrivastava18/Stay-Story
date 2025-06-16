import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Reviewcard.css";
import locationIcon from "../icons/619.png";

const Reviewcard = ({
  id,
  placeName,
  reviewerName,
  reviewerId,
  location,
  reviewText,
  rating,
  images = [],
  facilities = [],
  likes = [],
}) => {
  const [likeCount, setLikeCount] = useState(likes.length || 0);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setLiked(likes.includes(decoded.id));
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, [likes]);

  const handleLikeClick = async () => {
    const token = localStorage.getItem("token");

    if (!token || !userId) {
      toast.error("Please log in to like the review.");
      return;
    }

    setIsLiking(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/review/like/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setLiked((prevLiked) => {
          setLikeCount((prevCount) => (prevLiked ? prevCount - 1 : prevCount + 1));
          return !prevLiked;
        });
      } else {
        toast.error(data.message || "Unable to like the review.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:2000";

  const getImageUrl = (img) => {
    if (typeof img === "string") {
      return img.startsWith("http") ? img : `${baseUrl}/${img.replace(/\\/g, "/")}`;
    } else if (typeof img === "object" && img?.url) {
      return img.url.startsWith("http") ? img.url : `${baseUrl}/${img.url.replace(/\\/g, "/")}`;
    }
    return "https://via.placeholder.com/400x200?text=No+Image";
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Corrected function to truncate location text
  const truncateLocation = (text, wordLimit) => {
    if (!text) return "";
    // Split by one or more spaces, filter out empty strings for robust word counting
    const words = text.trim().split(/\s+/);
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  // Apply truncation for location, using 2 words as specified
  const displayedLocation = truncateLocation(location, 2); 

  // Function to handle link click and scroll to top
  const handleLinkClick = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div className="reviewcard">
      <Link to={`/review/${id}`} className="reviewcard-link" onClick={handleLinkClick}>
        <div className="image-slider-container">
          {images.length > 0 ? (
            <>
              <img
                src={getImageUrl(images[currentImageIndex])}
                alt={`review-img-${currentImageIndex}`}
                className="slider-image"
              />
              {images.length > 1 && (
                <>
                  <button className="prev-btn" onClick={prevImage}>◀</button>
                  <button className="next-btn" onClick={nextImage}>▶</button>
                </>
              )}
            </>
          ) : (
            <img
              src="https://via.placeholder.com/400x200?text=No+Image"
              alt="placeholder"
              className="slider-image"
            />
          )}
        </div>
      </Link>

      <div className="reviewcontent">
        <div className="nameadd">
          <h2>{placeName}</h2>
          <div className="location">
            <img src={locationIcon} alt="location icon" className="location-icon" />
            {displayedLocation} {/* Use the truncated location here */}
          </div>
        </div>

        <p className="review-text clamped">{reviewText}</p>

        {reviewText?.length > 120 && (
          // Apply handleLinkClick to this Link as well if it navigates to the same review detail page
          <Link to={`/review/${id}`} className="read-more" onClick={handleLinkClick}>
            Read more
          </Link>
        )}

        <div className="reviewlike">
          <p className="rating">⭐ Rating: {rating}/5</p>

          <div className="review-actions">
            <button
              className={`like-btn ${liked ? "liked" : ""}`}
              onClick={handleLikeClick}
              disabled={isLiking}
            >
              👍 {likeCount}
            </button>
          </div>
        </div>

        <p className="author-name">
          Reviewed by: <strong>{reviewerName || "Anonymous"}</strong>
          {userId === reviewerId && <span> (you)</span>}
        </p>

        <div className="tags">
          {facilities.length > 0 ? (
            facilities.map((facility, idx) => (
              <span key={idx} className="tag">
                {facility}
              </span>
            ))
          ) : (
            <span className="tag">No facilities mentioned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviewcard;