import { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../StoreContext";
import "./ReviewDetailPage.css";
import CommentSection from "../components/CommentSection";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const { user, token } = useContext(StoreContext);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/review/${id}`);
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching review details:", error);
      }
    };
    fetchReview();
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append("images", file));

    try {
      const res = await axios.put(
        `http://localhost:2000/review/upload-images/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type manually for FormData!
          },
        }
      );

      if (res.data.success) {
        toast.success("Images uploaded!");
        setReview(prev => ({
          ...prev,
          image: [...(prev.image || []), ...res.data.images],
        }));
      }
    } catch (err) {
      toast.error("Failed to upload images");
      console.error("Upload error:", err);
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
      <div className="review-content">
        <div className="review-left">
          <h1 className="review-title">{review.name}</h1>

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

          {isAuthor && (
            <div style={{ marginTop: "12px" }}>
              <label htmlFor="upload-more" className="edit-btn">Add More Pictures</label>
              <input
                id="upload-more"
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>

        <div className="review-info">
          <div className="info-row three-column-layout">
            <div className="info-col">
              <div className="facilities">
                <h3>Facilities:</h3>
                <ul>
                  {review.facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="info-col">
              <h3>Facilities Ratings:</h3>
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

          <CommentSection reviewId={id} />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
