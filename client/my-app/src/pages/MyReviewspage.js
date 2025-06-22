import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../StoreContext";
import Reviewcard from "../components/Reviewcard";
import "./MyReviewspage.css";

const MyReviewspage = () => {
  const { token ,apiUrl} = useContext(StoreContext);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await axios.get(`${apiUrl}/review/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyReviews(res.data.reviews);
      } catch (error) {
        console.error("Error fetching my reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, [token]);

  if (loading) {
    return <div className="loading">Loading your reviews...</div>;
  }

  return (
    <div className="my-reviews-page">
      <div className="my-reviews-header">
        <h1>Here are your reviews</h1>
        <p>Manage your valuable feedback.</p>
      </div>
      <div className="review-card-container">
        {myReviews.length === 0 ? (
          <p className="no-reviews-message">You have not created any review yet.</p>
        ) : (
          myReviews.map((item, index) => (
            <Reviewcard
              key={index}
              id={item._id}
              placeName={item.name}
              reviewerName={item.user?.name || "Anonymous"}
              reviewerId={item.user?._id}
              location={item.location}
              reviewText={item.reviewText}
              rating={item.rating}
              images={item.image}
              facilities={item.facilities}
              likes={item.likes}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyReviewspage;