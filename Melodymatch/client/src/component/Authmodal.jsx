

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./Authmodal.css"

const Authmodal = ({ setshowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmpassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  const handleClick = () => {
    setshowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmpassword) {
        setError("Passwords need to match");
        return;
      }

    //   const response = await axios.post(
    //     `${import.meta.env.VITE_SERVER_URL}/${isSignUp ? "signup" : "login"}`,
    //     { email, password }
    //   );

    //   setCookie("AuthToken", response.data.token);
    //   setCookie("UserId", response.data.userId);

    //   const success = response.status === 201;

    //   if (success && isSignUp) navigate("/");
    //   if (success && !isSignUp) navigate("/");

    //   window.location.reload();
   const response = await axios.post(
  `${import.meta.env.VITE_SERVER_URL}/${isSignUp ? "signup" : "login"}`,
  { email, password }
);

setCookie("AuthToken", response.data.token);
setCookie("UserId", response.data.userId);

const success = response.status === 201;

if (success) {
  // ✅ Fetch user profile using query param
  const userRes = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/user`,
    { params: { userId: response.data.userId } }
  );

  const user = userRes.data;

  // ✅ Save name + profile image to localStorage
  localStorage.setItem("first_name", user.first_name);
  localStorage.setItem("profile_url", user.url);

  navigate("/");
  window.location.reload();
}


     } catch (error) {
      (error);
      setError("Something went wrong. Try again.");
    }
  };

return (
  <>
    <div className="modal-backdrop" onClick={handleClick}></div>

    <div className="auth-modal vibrant-theme">
      <div className="close-icon" onClick={handleClick}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <h2 className="modal-title">{isSignUp ? "Create Account" : "Log In"}</h2>
      <p className="modal-subtitle">
        By clicking <strong>{isSignUp ? "create account" : "log in"}</strong>, you agree to our
        <span className="link"> Terms </span> and <span className="link"> Privacy Policy</span>.
      </p>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="📧 Email" required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" name="password" placeholder="🔒 Password" required onChange={(e) => setPassword(e.target.value)} />
          {isSignUp && (
            <input type="password" name="password-check" placeholder="🔁 Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
          )}
          <input className="submit-button" type="submit" value={isSignUp ? "🎵 Create Account" : "🎶 Log In"} />
          <p className="error-message">{error}</p>
        </form>
      </div>

      <hr className="divider" />
      <h3 className="get-app-text">🎧 Get the App</h3>
    </div>
  </>
);


};

export default Authmodal;
