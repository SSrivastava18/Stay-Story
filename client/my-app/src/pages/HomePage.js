import React from "react";
import Search from "../components/Search";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      <div className="search-section">
        <h1 className="homepage-title">Find the Perfect Stay for Yourself</h1>
        <p className="homepage-subtitle">
          Discover and share stories of PGs, hostels, and flats from anywhere across the country
        </p>
        <div className="ss">
          <Search />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
