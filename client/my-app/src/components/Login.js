import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../StoreContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import 'react-toastify/dist/ReactToastify.css';
import '../style.css';

const Login = ({ setshowLogin }) => {
      const { apiUrl } = useContext(StoreContext);
  const { setToken, getUserData } = useContext(StoreContext);
  const navigate = useNavigate();
  const [page, setPage] = useState("Sign up");
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setdata((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let endpoint = page === "Login" ? "/user/login" : "/user/signup";

    if (page === "Sign up" && !data.email.endsWith("@gmail.com")) {
      toast.error("Only Gmail addresses are allowed for signup", { autoClose: 1500 });
      return;
    }

    try {
      const res = await axios.post(apiUrl + endpoint, data);
      if (res.data.success) {
        const token = res.data.token;
        setToken(token);
        localStorage.setItem("token", token);

        if (typeof getUserData === "function") {
          await getUserData(token);
        }

        setshowLogin(false);
        toast.success("Logged in successfully", { autoClose: 1500 });
      } else {
        toast.error(res.data.message || "Signup/Login failed", { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred", { autoClose: 1500 });
    }
  };

  const googleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${apiUrl}/user/google-login`, {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        const token = res.data.token;
        setToken(token);
        localStorage.setItem("token", token);

        if (typeof getUserData === "function") {
          await getUserData(token);
        }

        setshowLogin(false);
        toast.success("Logged in with Google!", { autoClose: 1500 });
      } else {
        toast.error("Google login failed.", { autoClose: 1500 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong with Google login.", { autoClose: 1500 });
    }
  };

  const googleFailure = () => {
    toast.error("Google login failed. Please try again.", { autoClose: 1500 });
  };

  return (
    <GoogleOAuthProvider clientId="1091041923756-srmtpoe9pbhab4gfcm2dmhqnjgcbj5nn.apps.googleusercontent.com">
      <div className="login-overlay">
        <div className="login-container">
          <button onClick={() => setshowLogin(false)} className="close-btn">
            ⨯
          </button>

          <h2 className="login-title">{page}</h2>
          <form onSubmit={handleSubmit} className="login-form">
            {page === "Sign up" && (
              <input
                onChange={handleOnchange}
                type="text"
                name="name"
                value={data.name}
                placeholder="Username"
                required
                className="input-field"
              />
            )}
            <input
              onChange={handleOnchange}
              type="email"
              name="email"
              value={data.email}
              placeholder="Email address"
              required
              className="input-field"
              autoComplete="email"
            />
            <input
              onChange={handleOnchange}
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              required
              className="input-field"
              autoComplete="current-password"
            />
            <button type="submit" className="login-btn">
              {page === "Sign up" ? "Create Account" : "Login now"}
            </button>

            <div className="google-login-container">
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
              />
            </div>

            <div className="terms-container">
              <input type="checkbox" required className="checkbox" />
              <p>
                Agree to the{" "}
                <span
                  className="terms-link"
                  onClick={() => {
                    setshowLogin(false);
                    navigate("/terms-of-use");
                  }}
                >
                  terms of use & privacy policy
                </span>.
              </p>
            </div>

            <p className="toggle-text">
              {page === "Sign up" ? (
                <>
                  Already have an account?{" "}
                  <span className="toggle-hover-link" onClick={() => setPage("Login")}>
                    Login here
                  </span>
                </>
              ) : (
                <>
                  Create an Account?{" "}
                  <span className="toggle-hover-link" onClick={() => setPage("Sign up")}>
                    Click here
                  </span>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
