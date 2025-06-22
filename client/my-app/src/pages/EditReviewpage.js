import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../StoreContext";
import "./EditReviewPage.css";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // ✅ default
import '../style.css';

const EditReviewpage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token,apiUrl } = useContext(StoreContext);

  const [reviewData, setReviewData] = useState({
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

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${apiUrl}/review/${id}`);
        const data = response.data;

        const existingImages = Array.isArray(data.image) ? data.image : [data.image].filter(Boolean);
        const normalizedImages = existingImages.map(img => ({ url: img.url, filename: img.filename }));

        setReviewData({ ...data, images: normalizedImages });
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
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setReviewData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...previews],
    }));
  };

  const handleRemoveImage = (index) => {
    setReviewData((prevData) => {
      const updated = [...prevData.images];
      updated.splice(index, 1);
      return { ...prevData, images: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    reviewData.images.forEach((img) => {
      if (img?.file) {
        formData.append("images", img.file);
      } else {
        formData.append("existingImages", img.url);
      }
    });

    Object.entries(reviewData.facilitiesRating).forEach(([k, v]) => {
      formData.append(`facilitiesRating[${k}]`, v);
    });

    ["facilities"].forEach((key) => {
      reviewData[key].forEach((item) => formData.append(`${key}[]`, item));
    });

    ["name", "location", "reviewText", "rating", "priceRange", "roomType", "pgType", "preferredTenant"].forEach(
      (key) => formData.append(key, reviewData[key])
    );

    try {
      const res = await axios.put(`${apiUrl}/review/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Review updated successfully", { autoClose: 1500 }); // ✅
        navigate(`/review/${id}`);
      } else {
        toast.error(res.data.message, { autoClose: 1500 }); // ✅
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", { autoClose: 1500 }); // ✅
    }

  };

  return (
    <div className="edit-review-container">
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={reviewData.name} onChange={handleChange} required />

        <label>Location</label>
        <input type="text" name="location" value={reviewData.location} onChange={handleChange} required />

        <label>Review</label>
        <textarea name="reviewText" value={reviewData.reviewText} onChange={handleChange} required />

        <label>Rating (0-5)</label>
        <input type="number" name="rating" value={reviewData.rating} onChange={handleChange} min="0" max="5" required />

        {/* Updated image section with spacing */}
        <div className="image-upload-section">
          <label>Uploaded Images</label>
          <div className="image-preview-wrapper">
            {reviewData.images.map((img, idx) => (
              <div className="image-preview-box" key={idx}>
                <img
                  src={img?.url || img}
                  alt={`Preview ${idx}`}
                  className="uploaded-image"
                />
                <span className="remove-image" onClick={() => handleRemoveImage(idx)}>
                  ×
                </span>
              </div>
            ))}
          </div>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        </div>

        <label>Price Range</label>
        <input type="text" name="priceRange" value={reviewData.priceRange} onChange={handleChange} />

        <label>Room Type</label>
        <select name="roomType" value={reviewData.roomType} onChange={handleChange}>
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
        <select name="preferredTenant" value={reviewData.preferredTenant} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Students">Students</option>
          <option value="Working Professionals">Working Professionals</option>
          <option value="Both">Both</option>
        </select>

        <h3>Facilities Rating (0-5)</h3>
        {Object.entries(reviewData.facilitiesRating).map(([key, value]) => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleFacilityRatingChange}
              min="0"
              max="5"
            />
          </div>
        ))}

        <button type="submit">Update Review</button>
      </form>
    </div>
  );
};

export default EditReviewpage;
