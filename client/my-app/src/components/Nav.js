import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../StoreContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import menu from "../icons/menu.png"; 
import logo from "../icons/logo.png";


const Nav = ({ setshowLogin }) => {
    const { token, setToken, setUser, user } = useContext(StoreContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const logOut = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser("");
        navigate("/");
        toast.success("Logged out successfully");
        setMenuOpen(false);
    };

    // New function to scroll to the footer
    const scrollToFooter = () => {
        const footerElement = document.getElementById("footer");
        if (footerElement) {
            footerElement.scrollIntoView({ behavior: "smooth" });
        }
        setMenuOpen(false); // Close mobile menu if open
    };

    return (
        <div className="navbox">
            {/* Logo - Wrapped with Link */}
            <Link to="/" onClick={() => setMenuOpen(false)}> {/* Add Link here */}
                <img src={logo} alt="logo icon" className="logo-icon" />
            </Link>

            {/* Center Navigation */}
            <div className="centernav">
                <Link to="/" onClick={() => setMenuOpen(false)}><button>Home</button></Link>
                {/* Changed from Link to a button that calls scrollToFooter */}
                <button onClick={scrollToFooter}>Contact</button>
                <Link to="/about" onClick={() => setMenuOpen(false)}><button>About Us</button></Link>
            </div>

            {/* Post & Auth Buttons */}
            <div className="reviewloginbox">
                <Link to="/post-review" onClick={() => setMenuOpen(false)}>
                    <button>Post Review</button>
                </Link>

                {!token ? (
                    <button onClick={() => setshowLogin(true)}>Signup</button>
                ) : (
                    <div className="userbox">
                        <div className="user-greeting" onClick={() => setMenuOpen(!menuOpen)}>
                            <p id="userName">Hi, {user.name}</p>
                            <span className="arrow">&#9662;</span>
                        </div>

                        {/* Dropdown for Desktop */}
                        <div className={`user-dropdown ${menuOpen ? "open" : ""}`}>
                            <Link to="/my-reviews" onClick={() => setMenuOpen(false)}>My Reviews</Link>
                            <button id="outbtn" onClick={logOut}>Logout</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hamburger (for mobile) */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                <img src={menu} alt="menu icon" className="menu-icon" />
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    {token && <p id="userName">Hi, {user.name}</p>}
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    {/* Changed from Link to a button that calls scrollToFooter in mobile menu */}
                    <button onClick={scrollToFooter}>Contact</button>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
                    <Link to="/post-review" onClick={() => setMenuOpen(false)}>Post Review</Link>

                    {token ? (
                        <>
                            <Link to="/my-reviews" onClick={() => setMenuOpen(false)}>My Reviews</Link>
                            <button id="outbtn" onClick={logOut}>Logout</button>
                        </>
                    ) : (
                        <button
                            id="signbtn"
                            onClick={() => {
                                setshowLogin(true);
                                setMenuOpen(false);
                            }}
                        >
                            Signup
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Nav;