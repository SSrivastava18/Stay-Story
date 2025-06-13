import { useState, useContext } from "react";
import axios from "axios";
import "./PostReviewPage.css";
import { toast } from "react-toastify";
import { StoreContext } from "../StoreContext";

const PostReviewPage = () => {
  const url = "http://localhost:2000";
  const { token } = useContext(StoreContext);

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
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFacilitiesChange = (e) => {
    const { value, checked } = e.target;
    setData((prevData) => ({
      ...prevData,
      facilities: checked
        ? [...prevData.facilities, value]
        : prevData.facilities.filter((facility) => facility !== value),
    }));
  };

  const handleFacilityRatingChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      facilitiesRating: {
        ...prevData.facilitiesRating,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "images" && data.images.length > 0) {
        data.images.forEach((img) => formData.append("images", img));
      } else if (key === "facilitiesRating") {
        Object.entries(data.facilitiesRating).forEach(([k, v]) => {
          formData.append(`facilitiesRating[${k}]`, v);
        });
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const res = await axios.post(url + "/review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
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
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="add-review-container">
      <form className="review-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={data.name} onChange={handleChange} required />

        <label>Location</label>
        <input type="text" name="location" value={data.location} onChange={handleChange} required />

        <label>Review</label>
        <textarea name="reviewText" value={data.reviewText} onChange={handleChange} required></textarea>

        <label>Rating (0-5)</label>
        <input
          type="number"
          name="rating"
          value={data.rating}
          onChange={handleChange}
          min="0"
          max="5"
          required
        />

        <label>Upload Images</label>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

        {data.images.length > 0 && (
          <div className="image-preview-container">
            {data.images.map((img, index) => (
              <img key={index} src={URL.createObjectURL(img)} alt={`preview-${index}`} />
            ))}
          </div>
        )}

        <label>Price Range</label>
        <input type="text" name="priceRange" value={data.priceRange} onChange={handleChange} />

        <label>Room Type</label>
        <select name="roomType" value={data.roomType} onChange={handleChange}>
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
                onChange={handleFacilitiesChange}
                checked={data.facilities.includes(facility)}
              />
              {facility}
            </label>
          ))}
        </div>

        <label>PG Type</label>
        <select name="pgType" value={data.pgType} onChange={handleChange}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Co-ed">Co-ed</option>
        </select>

        <label>Preferred Tenant</label>
        <select name="preferredTenant" value={data.preferredTenant} onChange={handleChange}>
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
          value={data.facilitiesRating.cleanliness}
          onChange={handleFacilityRatingChange}
          min="0"
          max="5"
        />

        <label>Food</label>
        <input
          type="number"
          name="food"
          value={data.facilitiesRating.food}
          onChange={handleFacilityRatingChange}
          min="0"
          max="5"
        />

        <label>Security</label>
        <input
          type="number"
          name="security"
          value={data.facilitiesRating.security}
          onChange={handleFacilityRatingChange}
          min="0"
          max="5"
        />

        <label>Internet</label>
        <input
          type="number"
          name="internet"
          value={data.facilitiesRating.internet}
          onChange={handleFacilityRatingChange}
          min="0"
          max="5"
        />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default PostReviewPage;
