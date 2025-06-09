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
  const sliderRef = useRef(null);

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

  const scrollImage = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!review) return <h2>Loading...</h2>;

  const isAuthor = user && review.user === user.id;

  return (
    <div className="review-detail-container">
      <div className="review-content flex-layout">
        <div className="review-left">
          <div className="image-slider-wrapper">
            <button className="slider-arrow left" onClick={() => scrollImage("left")}>&#9664;</button>
            <div className="image-slider" ref={sliderRef}>
              {Array.isArray(review.image) &&
                review.image.map((img, i) =>
                  img?.url ? (
                    <img key={i} src={img.url} alt={`review-${i}`} className="slider-image" />
                  ) : null
                )}
            </div>
            <button className="slider-arrow right" onClick={() => scrollImage("right")}>&#9654;</button>
          </div>
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
