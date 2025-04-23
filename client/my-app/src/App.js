

import './App.css';


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useState } from "react";
import Login from "./components/Login";
import PostReviewPage from "./pages/PostReviewPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import Nav from "./components/Nav";
import { ToastContainer } from "react-toastify";
import { StoreContext } from "./StoreContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import EditReviewPage from './pages/EditReviewpage';

function App() {

    const { token } = useContext(StoreContext);
  function ProtectedRoute({ element }) {
    if (!token) {
      toast.error("You are not Logged in. Please login to continue.");
      return <Navigate to="/"  />;
    }
  
    return element;
  }

  const [showLogin, setshowLogin] = useState(false);
  return (
    <div className="appbox">
      <ToastContainer />
      {showLogin?<Login setshowLogin={setshowLogin} />:<></>}
      <Nav setshowLogin={setshowLogin} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post-review" element={<ProtectedRoute element={<PostReviewPage />} />} />
        <Route path="/review/:id" element={<ReviewDetailPage />} />
        <Route path="/edit-review/:id" element={<EditReviewPage />} />
                
            </Routes>
    </div>
  );
}

export default App;
