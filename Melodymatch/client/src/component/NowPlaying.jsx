import { useEffect, useState } from "react";
import axios from "axios";

export default function NowPlaying() {
  const [track, setTrack] = useState(null);
  const token = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const res = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 200 && res.data) {
          setTrack(res.data.item);
        } else {
          setTrack(null);
        }
      } catch (err) {
        console.error("Error fetching current track:", err);
      }
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [token]);

  if (!track) return <p>Nothing is playing</p>;

  return (
    <div style={{
      marginTop: "2rem",
      padding: "1rem",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.1)",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
      <img src={track.album.images[0]?.url} alt="Album Art" width="80" style={{ borderRadius: "10px" }} />
      <div>
        <h4 style={{ margin: 0 }}>{track.name}</h4>
        <p style={{ margin: 0 }}>by {track.artists.map(a => a.name).join(", ")}</p>
        <p style={{ margin: 0, fontSize: "0.85rem" }}>{track.album.name}</p>
      </div>
    </div>
  );
}
