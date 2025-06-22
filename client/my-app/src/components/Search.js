import { useEffect, useState } from "react";
import Reviewcard from "./Reviewcard";
import "./Search.css"; // Ensure this CSS file exists and is linked
import { StoreContext } from "../StoreContext";
import { useContext } from "react";
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
        const {apiUrl } = useContext(StoreContext);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(12); // Display 12 reviews per page (4 columns * 3 rows)

    useEffect(() => {
        fetchAllReviews();
    }, []);

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            setIsSearching(false);
            setCurrentPage(1); // Reset to first page on new fetch

            const res = await fetch(`${apiUrl}/review`);
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
            setIsSearching(true);
            setCurrentPage(1); // Reset to first page on new search

            const res = await fetch(
                `${apiUrl}/review/search?query=${encodeURIComponent(query)}`
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

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li
                    key={i}
                    className={`page-item ${currentPage === i ? "active" : ""}`}
                >
                    <button onClick={() => paginate(i)} className="page-link">
                        {i}
                    </button>
                </li>
            );
        }
        return pageNumbers;
    };

    return (
        <div className="search-wrapper">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search by Name or Location"
                        className="search-bar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchTerm && (
                        <span className="clear-icon" onClick={handleClear}>×</span>
                    )}
                    <button
                        className="search-button"
                        onClick={handleSearchClick}
                        disabled={loading}
                    >
                        Search
                    </button>
                </div>
            </div>

            <h2 style={{ textAlign: "center", marginTop: "20px", color: "#333" }}>
                {isSearching ? "Search Results" : ""}
            </h2>

            {loading && (
                <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>
            )}

            {error && !loading && (
                <p className="error-message" style={{ textAlign: "center", color: "red" }}>
                    {error}
                </p>
            )}

            {!loading && reviews.length === 0 && !error && (
                <p style={{ textAlign: "center", color: "#ccc" }}>
                    No reviews to show.
                </p>
            )}

            <div className="review-cards-wrapper">
                {currentReviews.map((review) => (
                    <Reviewcard
                        key={review._id}
                        id={review._id}
                        placeName={review.name}
                        reviewerName={review.user?.name}
                        reviewerId={review.user?._id}
                        location={review.location}
                        reviewText={review.reviewText}
                        rating={review.rating}
                        images={Array.isArray(review.images) ? review.images : []}
                        facilities={review.facilities}
                        likes={review.likes}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {reviews.length > reviewsPerPage && (
                <nav className="pagination-container">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                className="page-link"
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                        </li>
                        {renderPageNumbers()}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                className="page-link"
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default Search;