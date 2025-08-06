import { useState } from "react";
import axios from "axios";

export default function SearchAndPlay({ deviceId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("spotify_access_token");

  const searchTracks = async () => {
    const res = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: "track", limit: 5 }
    });
    setResults(res.data.tracks.items);
  };

  const playTrack = async (uri) => {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [uri] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div style={{ marginTop: "2rem", color: "white" }}>
      <h3>🔍 Search Songs</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or artist"
        style={{ padding: "5px", marginRight: "5px" }}
      />
      <button onClick={searchTracks}>Search</button>

      <ul style={{ marginTop: "1rem" }}>
        {results.map((track) => (
          <li key={track.id}>
            🎵 <strong>{track.name}</strong> — {track.artists[0].name}
            <button onClick={() => playTrack(track.uri)} style={{ marginLeft: "10px" }}>
              ▶️ Play
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
