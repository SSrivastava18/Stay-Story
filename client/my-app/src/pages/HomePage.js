import React from "react";
import Search from "../components/Search";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      <div className="search-section">
        <h1 className="homepage-title">Find the Perfect PG or Stay</h1>
        <p className="homepage-subtitle">Search by location or name and explore verified reviews</p>
        <div className="ss">
          <Search />
        </div>
        
      </div>
    </div>
  );
};

export default HomePage;
