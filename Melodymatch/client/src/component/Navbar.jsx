






import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCookies } from 'react-cookie';
import whitelogo from "../images/whitelogo.png";

const Navbar = ({ setshowModal, showModal, authToken, setisSignUp }) => {
  const [cookies] = useCookies(["onboarded"]);
  

  const handleClick = () => {
    setshowModal(true);
    setisSignUp(false);
  };

  return (
    <nav className="navbar gradient-navbar">
      {/* Left: Logo */}
      <div className="nav-section nav-left">
        <Link to="/">
          <img className="logo" src={whitelogo} alt="Melody Match Logo" />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="nav-section nav-center">
        <Link to="/"> 🎤 About</Link>

        {/* Only show ONBOARDING if not completed yet */}
        {authToken && <Link to="/onboarding"> 🚀 Onboarding</Link>}

        {/* Show these only if user is onboarded */}
        {authToken &&  <Link to="/dashboard">💘 Dashboard</Link>}

        
        {authToken &&  <Link to="/loginspotifypage">🎶 LoginSpotify</Link>}

         {authToken &&  <Link to="/room">🎧 MusicRoom</Link>}
        
        {authToken &&  <Link to="/music/concerts"> 🎫 Concerts</Link>}
      </div>

      {/* Right: CTA Button */}
      <div className="nav-section nav-right">
        {!authToken && (
          <button
            className="nav-button"
            onClick={handleClick}
            disabled={showModal}
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
