import { useState, useContext, useEffect } from "react";
import axios from "axios";
import "./PostReviewPage.css";
import { toast } from "react-toastify";
import { StoreContext } from "../StoreContext";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';  // ✅ default
import '../style.css';

const PostReviewPage = () => {
	const { token,apiUrl } = useContext(StoreContext);
	const navigate = useNavigate();

	const [data, setData] = useState({
		name: "",
		location: "",
		reviewText: "",
		rating: "",
		images: [],
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFacilitiesChange = (e) => {
		const { value, checked } = e.target;
		setData((prev) => ({
			...prev,
			facilities: checked
				? [...prev.facilities, value]
				: prev.facilities.filter((f) => f !== value),
		}));
	};

	const handleFacilityRatingChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({
			...prev,
			facilitiesRating: { ...prev.facilitiesRating, [name]: value },
		}));
	};

	const handleImageUpload = (e) => {
		const files = [...e.target.files];
		setData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
	};

	const handleImageRemove = (idx) => {
		setData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== idx),
		}));
	};

	const handleSubmit = async (e) => {
    e.preventDefault();
  const wordCount = data.reviewText.trim().split(/\s+/).filter(word => word !== "").length;
  if (wordCount < 20) {
    toast.error("Review must be at least 20 words long.");
    return;
  }
		const formData = new FormData();

		Object.keys(data).forEach((key) => {
			if (key === "images" && data.images.length) {
				data.images.forEach((img) => formData.append("images", img));
			} else if (key === "facilitiesRating") {
				Object.entries(data.facilitiesRating).forEach(([k, v]) =>
					formData.append(  `facilitiesRating[${k}]`, v)
				);
			} else if (Array.isArray(data[key])) {
				data[key].forEach((item) => formData.append(`${key}[]`, item));
			} else {
				formData.append(key, data[key]);
			}
		});

		try {
			const { data: res } = await axios.post(`${apiUrl}/review`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});

			if (res.success) {
				toast.success(res.message);
				navigate("/");
				setData({
					name: "",
					location: "",
					reviewText: "",
					rating: "",
					images: [],
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
			} else {
				toast.error(res.message);
			}
		} catch (err) {
			toast.error(err.response?.data?.message || "Something went wrong");
		}
	};

	useEffect(() => {
		return () => {
			data.images.forEach((img) => URL.revokeObjectURL(img.preview));
		};
	}, [data.images]);

	return (
		<div className="add-review-container">
			<form className="review-form" onSubmit={handleSubmit}>
				<label>Name of your Stay</label>
				<input
					name="name"
					value={data.name}
					onChange={handleChange}
					required
					placeholder="e.g., LM PG"
				/>

				<label>Location of your Stay</label>
				<input
					name="location"
					value={data.location}
					onChange={handleChange}
					required
					placeholder="e.g., B26 , Block B, Gamma1, Greater Noida"
				/>

				<label>Your Stay-Story</label>
				<textarea
					name="reviewText"
					value={data.reviewText}
					onChange={handleChange}
					required
					placeholder="Share your experience (at least 20 words)"
				/>
			

				<label>Rate Your Stay (0‑5)</label>
				<input
					type="number"
					name="rating"
					value={data.rating}
					onChange={handleChange}
					min="0"
					max="5"
					step="0.5"
					required
					placeholder="e.g., 4.5"
				/>

				<label>Upload Images</label>
				<input
					type="file"
					accept="image/*"
					multiple
					onChange={handleImageUpload}
				/>

				{data.images.length > 0 && (
					<div className="image-preview-container">
						{data.images.map((img, idx) => (
							<div key={idx} className="image-preview-item">
								<img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />

								<button
									type="button"
									className="remove-image-btn"
									onClick={() => handleImageRemove(idx)}
								>
									&times;
								</button>
							</div>
						))}
					</div>
				)}

				<label>Price Range</label>
				<input
					name="priceRange"
					value={data.priceRange}
					onChange={handleChange}
					placeholder="e.g., ₹5,000 - ₹8,000/month"
				/>

				<label>What kind of place have you lived in or are currently living in?</label>
				<select name="roomType" value={data.roomType} onChange={handleChange}>
					<option value="">Select</option>
					{["PG", "Hostel", "Flat"].map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>

				<label>Facilities</label>
				<div className="checkbox-group">
					{["WiFi", "Laundry", "Meals", "Parking", "Gym"].map((f) => (
						<label key={f}>
							<input
								type="checkbox"
								value={f}
								checked={data.facilities.includes(f)}
								onChange={handleFacilitiesChange}
							/>
							{f}
						</label>
					))}
				</div>

				<label>Gender preference at your stay</label>
				<select name="pgType" value={data.pgType} onChange={handleChange}>
					<option value="">Select</option>
					{["Male", "Female", "Co-ed"].map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>

				<label>Preferred Tenant</label>
				<select
					name="preferredTenant"
					value={data.preferredTenant}
					onChange={handleChange}
				>
					<option value="">Select</option>
					{["Students", "Working Professionals", "Both"].map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>

				<h3>Facilities Rating (0‑5)</h3>
				{["cleanliness", "food", "security", "internet"].map((field) => (
					<div key={field}>
						<label>{field[0].toUpperCase() + field.slice(1)}</label>
						<input
							type="number"
							name={field}
							value={data.facilitiesRating[field]}
							onChange={handleFacilityRatingChange}
							min="0"
							max="5"
							step="0.5"
							placeholder={`Rate ${field} (0-5)`}
						/>
					</div>
				))}

				<button type="submit">Submit Review</button>
			</form>
		</div>
	);
};

export default PostReviewPage;