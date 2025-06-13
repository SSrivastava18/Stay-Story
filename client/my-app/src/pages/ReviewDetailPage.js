import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../StoreContext";
import "./ReviewDetailPage.css";
import CommentSection from "../components/CommentSection";
import Reviewcard from "../components/Reviewcard";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [similarReviews, setSimilarReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const { user, token } = useContext(StoreContext);
  const fileInputRef = useRef();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchReview = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/review/${id}`);
      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review details:", error);
    }
  };

  const fetchSimilarReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:2000/review/${id}/similar`);
      setSimilarReviews(res.data.similarReviews || []);
    } catch (error) {
      console.error("Error fetching similar reviews:", error);
    }
  };

  useEffect(() => {
    fetchReview();
    fetchSimilarReviews();
  }, [id]);

  const scrollImage = (direction) => {
    if (!review?.image?.length) return;
    const maxIndex = review.image.length - 1;
    setCurrentImageIndex((prev) => {
      if (direction === "left") return prev === 0 ? maxIndex : prev - 1;
      else return prev === maxIndex ? 0 : prev + 1;
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        `http://localhost:2000/review/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success && res.data.updatedImages) {
        setReview((prev) => ({
          ...prev,
          image: res.data.updatedImages,
        }));
        toast.success("Images uploaded successfully!");
      } else {
        toast.error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading images.");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:2000/review/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setReview(null);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete review.");
    }
  };

  const isAuthor = user && review?.user === user.id;

  if (!review) return <h2>Loading...</h2>;

  return (
    <div className="review-detail-container">
      <div className="review-content flex-layout">
        <div className="review-left">
          <div className="image-slider-wrapper">
            <button className="slider-arrow left" onClick={() => scrollImage("left")}>&#9664;</button>
            {review.image?.[currentImageIndex]?.url && (
              <img
                src={review.image[currentImageIndex].url}
                alt={`review-${currentImageIndex}`}
                className="slider-image single"
              />
            )}
            <button className="slider-arrow right" onClick={() => scrollImage("right")}>&#9654;</button>
          </div>
          {review.image?.length > 1 && (
            <p className="image-count">
              {currentImageIndex + 1} / {review.image.length}
            </p>
          )}
          <h1 className="review-title below-image">{review.name}</h1>

          <div className="comment-wrapper">
            <CommentSection reviewId={id} />
          </div>
        </div>

        <div className="review-info">
          <div className="review-text-card">
            <div className="quote-box">
              <p className="quote-text">
                “A good stay is not just about the bed you sleep in, but the comfort you feel, the people you meet, and the memories you make.”
              </p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-col">
              <h3 className="fs">Facilities:</h3>
              <ul>
                {review.facilities.map((facility, index) => (
                  <li key={index}>{facility}</li>
                ))}
              </ul>
            </div>

            <div className="info-col">
              <h3 className="fac">Facilities Ratings:</h3>
              <ul>
                {Object.entries(review.facilitiesRating).map(([key, value], index) => (
                  <li key={index}><strong>{key}:</strong> {value}/5</li>
                ))}
              </ul>
            </div>

            <div className="info-col meta-column">
              <p><strong>Location:</strong> {review.location}</p>
              <p><strong>Rating:</strong> ⭐ {review.rating}/5</p>
              <p><strong>Price Range:</strong> {review.priceRange}</p>
              <p><strong>Room Type:</strong> {review.roomType}</p>
            </div>
          </div>

          <div className="review-text-card">
            <h3>Review</h3>
            <p>{review.reviewText}</p>
          </div>

          {isAuthor && (
            <div className="review-buttons">
              <button className="edit-btn" onClick={() => navigate(`/edit-review/${id}`)}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>Delete</button>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="recommended-reviews-wrapper">
        <h3 id="similar">You may also like these...</h3>
        <div className="review-card-container full-width-layout">
          {similarReviews.length === 0 ? (
            <p>No recommendations found.</p>
          ) : (
            similarReviews.slice(0, visibleCount).map((item, index) => (
              <Reviewcard
                key={index}
                id={item._id}
                placeName={item.name}
                reviewerName={item.user?.name || "Anonymous"}
                reviewerId={item.user?._id}
                location={item.location}
                reviewText={item.reviewText}
                rating={item.rating}
                images={item.images}
                facilities={item.facilities}
                likes={item.likes}
              />
            ))
          )}
        </div>

        {visibleCount < similarReviews.length && (
          <div className="see-more-container">
            <button
              className="see-more-button"
              onClick={() => setVisibleCount(similarReviews.length)}
            >
              See More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewDetailPage;
