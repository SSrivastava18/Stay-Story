import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../StoreContext";
import { useContext } from "react";
import { toast } from "react-toastify";
const Nav = ({ setshowLogin }) => {
  const { token, setToken,setUser,user } = useContext(StoreContext);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setUser("");
    toast.success("Logged out successfully");
  };
  return (
    <div className="navbox">
      <div className="logobox">
        <img src="logo.avif" alt="logo" height="50px" />
        <h2>StayStory</h2>
      </div>
      <div className="centernav">
        <Link to="/">
          <button>Home</button>
        </Link>
        <button>Contact</button>
        
      </div>

      <div className="reviewloginbox">
         <Link to="/post-review">
          <button>Post Your Review</button>
        </Link>
        
        {!token ? (
          <button
            onClick={() => setshowLogin(true)}
          >
            Signup
          </button>
        ) : (
          <div className="userbox">
          <p id="userName">Hi,{ user.name}</p>
                 <button onClick={logOut}>Logout</button>
        </div>
        )}
      </div>
    </div>
  );
}
export default Nav;
