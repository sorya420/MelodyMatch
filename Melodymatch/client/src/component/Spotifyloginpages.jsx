import React from "react";
import { SpotifyAuthutil } from "./SpotifyAuthutil";
const LoginWithSpotify = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎧 Login with Spotify</h1>
      <button onClick={SpotifyAuthutil}>Login</button>
    </div>
  );
};

export default LoginWithSpotify;
