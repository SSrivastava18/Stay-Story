import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [review_list, setreview_list] = useState([]);
  const apiUrl = "http://localhost:2000"; // Update if deployed

  const getUserData = (token) => {
    try {
      const decoded = jwtDecode(token);
      const user = { id: decoded.id, email: decoded.email, name: decoded.name };
      setUser(user);
      setLoggedInUser(user);
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("token");
      setToken("");
      setUser("");
      setLoggedInUser(null);
    }
  };

  useEffect(() => {
    if (token) {
      getUserData(token);
    }
  }, [token]);

  const getReviewList = async () => {
    try {
      let res = await axios.get(apiUrl + "/review");
      setreview_list(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await getReviewList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
      }
    };
    initialize();
  }, []);

  const contextVal = {
    review_list,
    apiUrl,
    token,
    setToken,
    loggedInUser,
    setLoggedInUser,
    user,
    setUser,
    getUserData, 
  };

  return (
    <StoreContext.Provider value={contextVal}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
