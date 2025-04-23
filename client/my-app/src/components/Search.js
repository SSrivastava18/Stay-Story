import { useEffect, useState } from "react";
import Reviewcard from "./Reviewcard";
import "./Search.css";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all reviews on first render
    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/review`);
            const data = await res.json();

            if (data.success) {
                setReviews(data.data);
            } else {
                setReviews([]);
                setError("Failed to load reviews.");
            }
        } catch (err) {
            console.error("Error loading reviews:", err);
            setReviews([]);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredReviews = async (query) => {
        if (!query) return;

        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/review/search?query=${encodeURIComponent(query)}`
            );
            const data = await res.json();

            if (data.success) {
                setReviews(data.reviews);
            } else {
                setReviews([]);
                setError("No matching reviews found.");
            }
        } catch (err) {
            console.error("Search error:", err);
            setReviews([]);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            fetchFilteredReviews(searchTerm.trim());
        }
    };

    const handleSearchClick = () => {
        fetchFilteredReviews(searchTerm.trim());
    };

    const handleClear = () => {
        setSearchTerm("");
        fetchAllReviews();
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Name or Location"
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-button" onClick={handleSearchClick} disabled={loading}>
                    Search
                </button>
                {searchTerm && (
                    <button className="clear-button" onClick={handleClear}>
                        Clear
                    </button>
                )}
            </div>

            <h2 style={{ textAlign: "center", marginTop: "20px", color: "#333" }}>All Reviews</h2>

            {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}

            {error && !loading && (
                <p className="error-message" style={{ textAlign: "center", color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && reviews.length === 0 && !error && (
                <p style={{ textAlign: "center", color: "#ccc" }}>No reviews to show.</p>
            )}

            <div className="review-cards-wrapper">
                {reviews.map((review) => (
                    <Reviewcard
                        key={review._id}
                        id={review._id}
                        placeName={review.name}
                        reviewerName={review.user?.name}
                        reviewerId={review.user?._id}
                        location={review.location}
                        reviewText={review.reviewText}
                        rating={review.rating}
                        images={review.images}
                        facilities={review.facilities}
                        likes={review.likes}
                    />
                ))}

            </div>
        </div>
    );
};

export default Search;
