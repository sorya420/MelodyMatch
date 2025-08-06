

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import Navbar from "../component/Navbar";
import Authmodal from "../component/Authmodal";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [showModal, setshowModal] = useState(false);
  const [isSignUp, setisSignUp] = useState(true);
  

  const authToken = cookies.AuthToken;
 

  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setshowModal(true);
    setisSignUp(true);
  };


  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
    

      {/* Navbar */}
      <Navbar
        authToken={authToken}
        minimal={false}
        setshowModal={setshowModal}
        showModal={showModal}
        setisSignUp={setisSignUp}
      />

      {/* Hero Section */}
      <div className="home hero-section">
        <h1 className="primary-title">Melodies build memories — together.</h1>

        <div className="scroll-text">
          <p>Your music. Your vibe. Your match. ❤️</p>
        </div>

        <button className="primary-button" onClick={handleClick}>
          {authToken ? "Sign Out" : "Create Account"}
        </button>

        {/* Music Wave Animation */}
        <div className="music-wave">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

      </div>

      {/* Auth Modal */}
      {showModal && (
        <Authmodal setshowModal={setshowModal} isSignUp={isSignUp} />
      )}

      {/* Footer */}
      <footer>
        <p>© 2025 Melody Match | Love. Listen. Connect.</p>
      </footer>
    </motion.div>
  );
};

export default Home;
