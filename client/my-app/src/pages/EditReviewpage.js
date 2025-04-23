
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../StoreContext";
import "./EditReviewPage.css";
import { toast } from "react-toastify";

const EditReviewpage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { token } = useContext(StoreContext);
	const [reviewData, setReviewData] = useState({
		name: "",
		location: "",
		reviewText: "",
		rating: "",
		image: null,
		priceRange: "",
		roomType: "",
		facilities: [],
		pgType: "",
		preferredTenant: "",
		facilitiesRating: {
			cleanliness: "",
			food: "",
			security: "",
			internet: "",
		},
	});

	useEffect(() => {
		const fetchReview = async () => {
			try {
				const response = await axios.get(`http://localhost:2000/review/${id}`);
				setReviewData(response.data);
			} catch (error) {
				console.error("Error fetching review details:", error);
			}
		};
		fetchReview();
	}, [id]);

	const handleChange = (e) => {
		setReviewData({ ...reviewData, [e.target.name]: e.target.value });
	};

	const handleFacilitiesChange = (e) => {
		const { value, checked } = e.target;
		setReviewData((prevData) => ({
			...prevData,
			facilities: checked
				? [...prevData.facilities, value]
				: prevData.facilities.filter((facility) => facility !== value),
		}));
	};

	const handleFacilityRatingChange = (e) => {
		const { name, value } = e.target;
		setReviewData((prevData) => ({
			...prevData,
			facilitiesRating: {
				...prevData.facilitiesRating,
				[name]: value,
			},
		}));
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		setReviewData((prevData) => ({
			...prevData,
			image: file,
		}));
	};

	const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
		Object.keys(reviewData).forEach((key) => {
			if (key === "image" && reviewData.image) {
				formData.append("image", reviewData.image); 
			} else if (key === "facilitiesRating") {
				Object.entries(reviewData.facilitiesRating).forEach(([ratingKey, ratingValue]) => {
					formData.append(`facilitiesRating[${ratingKey}]`, ratingValue);
				});
			} else if (Array.isArray(reviewData[key])) {
				reviewData[key].forEach((item) => formData.append(`${key}[]`, item));
			} else {
				formData.append(key, reviewData[key]);
			}
		});
		
        try {
			const res = await axios.put(`http://localhost:2000/review/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					 Authorization: `Bearer ${token}` , 
				},
			});
			
			if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/review/${id}`);
				}
				
			else {
				toast.error(res.data.message);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	};

	return (
		<div className="edit-review-container">
			<h2>Edit Review</h2>
			<form onSubmit={handleSubmit}>
				<label>Name</label>
				<input
					type="text"
					name="name"
					value={reviewData.name}
					onChange={handleChange}
					required
				/>

				<label>Location</label>
				<input
					type="text"
					name="location"
					value={reviewData.location}
					onChange={handleChange}
					required
				/>

				<label>Review</label>
				<textarea
					name="reviewText"
					value={reviewData.reviewText}
					onChange={handleChange}
					required
				></textarea>

				<label>Rating (0-5)</label>
				<input
					type="number"
					name="rating"
					value={reviewData.rating}
					onChange={handleChange}
					min="0"
					max="5"
					required
				/>

			

				<label>Uploaded Image</label>
				{reviewData.image  && (
					<img
						src={reviewData.image.url}
						alt="Previously uploaded"
						className="uploaded-image"
					/>
				)}
				<input type="file" accept="image/*" onChange={handleImageUpload} />

				<label>Price Range</label>
				<input
					type="text"
					name="priceRange"
					value={reviewData.priceRange}
					onChange={handleChange}
				/>

				<label>Room Type</label>
				<select
					name="roomType"
					value={reviewData.roomType}
					onChange={handleChange}
				>
					<option value="">Select</option>
					<option value="Single">Single</option>
					<option value="Double">Double</option>
					<option value="Triple">Triple</option>
					<option value="Shared">Shared</option>
				</select>

				<label>Facilities</label>
				<div className="checkbox-group">
					{["WiFi", "Laundry", "Meals", "Parking", "Gym"].map((facility) => (
						<label key={facility}>
							<input
								type="checkbox"
								value={facility}
								checked={reviewData.facilities.includes(facility)}
								onChange={handleFacilitiesChange}
							/>
							{facility}
						</label>
					))}
				</div>

				<label>PG Type</label>
				<select name="pgType" value={reviewData.pgType} onChange={handleChange}>
					<option value="">Select</option>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
					<option value="Co-ed">Co-ed</option>
				</select>

				<label>Preferred Tenant</label>
				<select
					name="preferredTenant"
					value={reviewData.preferredTenant}
					onChange={handleChange}
				>
					<option value="">Select</option>
					<option value="Students">Students</option>
					<option value="Working Professionals">Working Professionals</option>
					<option value="Both">Both</option>
				</select>

				<h3>Facilities Rating (0-5)</h3>
				<label>Cleanliness</label>
				<input
					type="number"
					name="cleanliness"
					value={reviewData.facilitiesRating.cleanliness}
					onChange={handleFacilityRatingChange}
					min="0"
					max="5"
				/>

				<label>Food</label>
				<input
					type="number"
					name="food"
					value={reviewData.facilitiesRating.food}
					onChange={handleFacilityRatingChange}
					min="0"
					max="5"
				/>

				<label>Security</label>
				<input
					type="number"
					name="security"
					value={reviewData.facilitiesRating.security}
					onChange={handleFacilityRatingChange}
					min="0"
					max="5"
				/>

				<label>Internet</label>
				<input
					type="number"
					name="internet"
					value={reviewData.facilitiesRating.internet}
					onChange={handleFacilityRatingChange}
					min="0"
					max="5"
				/>

				<button type="submit">Update Review</button>
			</form>
		</div>
	);
};

export default EditReviewpage;
