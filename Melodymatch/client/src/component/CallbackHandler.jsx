// src/auth/CallbackHandler.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CallbackHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const getAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const codeVerifier = localStorage.getItem("spotify_code_verifier");

      if (!code || !codeVerifier) {
        console.error("Missing code or verifier");
        return;
      }

      try {
        const response = await axios.post("https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "https://melody-match-3wi6.onrender.com/callback", // Replace this
            client_id: "76172eb405974433bed17346bf7b15df", // Replace this
            code_verifier: codeVerifier,
          }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const { access_token } = response.data;
        localStorage.setItem("spotify_access_token", access_token);
        ("Access token:", access_token);
        navigate("/room"); 
      } catch (error) {
  console.error("Token exchange failed:", error.response?.data || error.message);
}
    };

    getAccessToken();
  }, [navigate]);

  return <p >Authenticating with Spotify...</p>;
}
