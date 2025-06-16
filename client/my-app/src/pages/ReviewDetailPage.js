import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../StoreContext";
import "./ReviewDetailPage.css";
import CommentSection from "../components/CommentSection";
import Reviewcard from "../components/Reviewcard"; // CORRECTED PATH HERE
import MapComponent from "../components/MapComponent";

// Import additional icons
import {
    FaStar,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaBroom,          // For cleanliness
    FaUtensils,       // For food
    FaShieldAlt,      // For security
    FaWifi,           // For internet
    FaRupeeSign,      // For Price Range
    FaBed,            // For Room Type
    FaParking,        // For Parking
    FaDumbbell,       // For Gym
    FaHandsWash,      // For Laundry
    FaBuilding,       // For PG Type
    FaUsers           // For Preferred Tenant
} from 'react-icons/fa';


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
      <div className="review-content">
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

          {/* User's written review (moved here) */}
          <div className="review-text-card">
              <h3>Review</h3>
              <p>{review.reviewText}</p>
          </div>

        </div>

        <div className="review-info">
          <div className="info-row">
            <div className="info-col facilities-section">
              <h3 className="section-heading">What this place offers:</h3>
              <div className="facilities-grid">
                {review.facilities.map((facility, index) => {
                    let FacilityIconComponent;
                    // Conditionally select icon based on the facility name
                    switch (facility.toLowerCase()) {
                        case 'wifi':
                            FacilityIconComponent = FaWifi;
                            break;
                        case 'meals':
                            FacilityIconComponent = FaUtensils;
                            break;
                        case 'parking':
                            FacilityIconComponent = FaParking;
                            break;
                        case 'gym':
                            FacilityIconComponent = FaDumbbell;
                            break;
                        case 'laundry':
                            FacilityIconComponent = FaHandsWash;
                            break;
                        default:
                            FacilityIconComponent = FaCheckCircle; // Default icon
                    }
                    return (
                        <div key={index} className="facility-item">
                            <FacilityIconComponent className="facility-icon" />
                            <p className="facility-text">{facility}</p>
                        </div>
                    );
                })}
              </div>
            </div>

            <div className="info-col ratings-section">
              <h3 className="section-heading">Facilities Ratings:</h3>
              <div className="ratings-grid">
                {Object.entries(review.facilitiesRating).map(([key, value], index) => {
                    let IconComponent;
                    switch (key.toLowerCase()) {
                        case 'cleanliness':
                            IconComponent = FaBroom;
                            break;
                        case 'food':
                            IconComponent = FaUtensils;
                            break;
                        case 'security':
                            IconComponent = FaShieldAlt;
                            break;
                        case 'internet':
                            IconComponent = FaWifi;
                            break;
                        default:
                            IconComponent = FaStar; // Default icon if no specific one is found
                    }
                    return (
                        <div key={index} className="rating-item">
                            <IconComponent className="rating-icon" />
                            <p className="rating-category">{key}</p>
                            <p className="rating-score">{value}/5</p>
                        </div>
                    );
                })}
              </div>
            </div>

            <div className="info-col meta-column">
                <h3 className="section-heading">About this place:</h3>
                <div className="meta-grid">
                    <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" />
                        <p className="meta-category">Location</p>
                        <p className="meta-value">{review.location}</p>
                    </div>
                    <div className="meta-item">
                        <FaStar className="meta-icon" />
                        <p className="meta-category">Rating</p>
                        <p className="meta-value">{review.rating}/5</p>
                    </div>
                    <div className="meta-item">
                        <FaRupeeSign className="meta-icon" />
                        <p className="meta-category">Price Range</p>
                        <p className="meta-value">{review.priceRange}</p>
                    </div>
                    <div className="meta-item">
                        <FaBed className="meta-icon" />
                        <p className="meta-category">Room Type</p>
                        <p className="meta-value">{review.roomType}</p>
                    </div>
                    {/* New additions for PG Type and Preferred Tenant */}
                    {review.pgType && (
                        <div className="meta-item">
                            <FaBuilding className="meta-icon" />
                            <p className="meta-category">PG Type</p>
                            <p className="meta-value">{review.pgType}</p>
                        </div>
                    )}
                    {review.preferredTenant && (
                        <div className="meta-item">
                            <FaUsers className="meta-icon" />
                            <p className="meta-category">Preferred Tenant</p>
                            <p className="meta-value">{review.preferredTenant}</p>
                        </div>
                    )}
                </div>
            </div>
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

          {/* Comment section (moved here) */}
          <div className="comment-wrapper">
            <CommentSection reviewId={id} />
          </div>

        </div> {/* End of review-info */}

      </div> {/* End of review-content */}

      <MapComponent className="map" location={review.location} />

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