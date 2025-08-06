

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "./Socket";
import "./MusicRoom.css";

export default function Room() {
  const userName = localStorage.getItem("first_name") || "User";
  const userPic = localStorage.getItem("profile_url") || "";
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
const [progress, setProgress] = useState(0);
const [chatMessages, setChatMessages] = useState([]);
const [inputMessage, setInputMessage] = useState("");
const chatEndRef = useRef(null);
const [isTyping, setIsTyping] = useState(false);
const [someoneTyping, setSomeoneTyping] = useState(null);




  const token = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    if (!token) return;

    const existingScript = document.getElementById("spotify-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
  const newPlayer = new window.Spotify.Player({
    name: "Harmonic Soul Player 🎵",
    getOAuthToken: cb => cb(token),
    volume: 0.5,
  });

  newPlayer.addListener("ready", ({ device_id }) => {
    console.log("✅ Player is ready with device ID:", device_id);
    setDeviceId(device_id);
    localStorage.setItem("spotify_device_id", device_id);
  });

  newPlayer.addListener("player_state_changed", (state) => {
    if (!state) return;
    setIsPaused(state.paused);

    const { current_track } = state.track_window;
    setNowPlaying({
      name: current_track.name,
      artist: current_track.artists.map(a => a.name).join(", "),
      albumArt: current_track.album.images[0]?.url,
      duration: state.duration,
    });

    setProgress(state.position);
  });

  newPlayer.connect();
  setPlayer(newPlayer); // Important!

  // ✅ Sync Playback Listener — place it here!
  socket.on("sync-play", async (data) => {
    if (!newPlayer) return;

    if (data.action === "play") {
      await newPlayer.resume();
    } else if (data.action === "pause") {
      await newPlayer.pause();
    } else if (data.action === "play-track" && data.uri) {
      try {
        await axios.put(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          { uris: [data.uri] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Track sync failed", err);
      }
    }
  });
  

// Receive message
socket.on("chat-message", (msg) => {
  setChatMessages(prev => [...prev, msg]);
});


};

  }, [token]);

  useEffect(() => {
  const interval = setInterval(() => {
    if (!player) return;
    player.getCurrentState().then(state => {
      if (!state) return;
      setProgress(state.position);
    });
  }, 1000);

  return () => clearInterval(interval);
}, [player]);


 const togglePlayback = () => {
  if (player) {
    player.getCurrentState().then(state => {
      const isPaused = state?.paused;
      if (isPaused) {
        player.resume();
        socket.emit("sync-play", { action: "play" });
      } else {
        player.pause();
        socket.emit("sync-play", { action: "pause" });
      }
    });
  }
};




  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: "track",
          limit: 10,
        },
      });
      setResults(res.data.tracks.items);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

 const playTrack = async (uri) => {
  if (!deviceId) return;
  try {
    await axios.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      { uris: [uri] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Emit sync-play event
    socket.emit("sync-play", { action: "play-track", uri });
  } catch (err) {
    console.error("Playback failed", err);
  }
};

  const sendMessage = () => {
  if (inputMessage.trim()) {
    const msg = {
      user: userName,
      avatar: userPic,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    socket.emit("chat-message", msg);
    setChatMessages(prev => [...prev, msg]); // Optional: instantly update UI
    setInputMessage("");
  }
};

useEffect(() => {
  if (chatEndRef.current) {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [chatMessages]);

useEffect(() => {
  socket.on("typing", (data) => {
    if (data.user !== userName) {
      setSomeoneTyping(data.user);
    }
  });

  const clearTyping = setInterval(() => {
    setSomeoneTyping(null);
  }, 2000); // clear after 2 sec

  return () => clearInterval(clearTyping);
}, []);

const handleInputChange = (e) => {
  setInputMessage(e.target.value);
  setIsTyping(true);
  
    socket.emit("typing", { user: userName }); 
};


  return (
    <div className="room-container">
      {/* Left: Search */}
      <div className="room-left">
        <h3>🎵 Search Music</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a song..."
          />
        </form>
        <div style={{ marginTop: "1rem" }}>
          {results.map((track) => (
            <div key={track.id} className="track-card">
              <img src={track.album.images[0]?.url} alt={track.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold" }}>{track.name}</div>
                <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                  by {track.artists[0].name}
                </div>
              </div>
              <button onClick={() => playTrack(track.uri)}>▶️ Play</button>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Now Playing */}
      <div className="room-center">
        <h1>🎧 Harmonic Soul</h1>
        {deviceId ? (
          <>
            <p style={{ marginBottom: "1rem", color: "#7fffd4" }}>
              ✅ Connected: <b>{deviceId}</b>
            </p>
            <button onClick={togglePlayback}>
              {isPaused ? "▶️ Play" : "⏸ Pause"}
            </button>
            {nowPlaying && (
  <div style={{ marginTop: "2rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
    <img
      src={nowPlaying.albumArt}
      alt="Album Art"
      style={{ width: "100%", borderRadius: "1rem", marginBottom: "1rem" }}
    />
    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{nowPlaying.name}</div>
    <div style={{ fontSize: "0.95rem", color: "#ccc" }}>{nowPlaying.artist}</div>

    <div style={{
      marginTop: "1rem",
      height: "8px",
      width: "100%",
      background: "#333",
      borderRadius: "5px",
      overflow: "hidden"
    }}>
      <div
        style={{
          width: `${(progress / nowPlaying.duration) * 100}%`,
          height: "100%",
          background: "#1db954",
          transition: "width 0.5s ease"
        }}
      ></div>
    </div>
  </div>
)}

          </>
        ) : (
          <p style={{ marginTop: "3rem", fontSize: "1.2rem", color: "#bbb" }}>
            🎶 Connecting to Spotify...
          </p>
        )}
      </div>

      {/* Right: Users / Chat */}
      <div className="room-right">
        <h3>🧑‍🤝‍🧑 Room Users</h3>
       <div className="chat-container">
        <div className="chat-panel">

  <div className="chat-messages">
  {chatMessages.map((msg, index) => {
    const isOwn = msg.user === localStorage.getItem("first_name");

    return (
      <div
        key={index}
        className={`chat-message ${isOwn ? "own-message" : ""}`}
      >
        {!isOwn && msg.avatar && (
          <img src={msg.avatar} alt="profile" className="chat-avatar" />
        )}

        <div className={`chat-bubble ${isOwn ? "own-bubble" : ""}`}>
          <div className="chat-header">
            <span className="chat-user">{msg.user}</span>
            <span className="chat-time">{msg.time}</span>
          </div>
          <div className="chat-text">{msg.text}</div>
        </div>

    

        {isOwn && msg.avatar && (
          <img src={msg.avatar} alt="profile" className="chat-avatar" />
        )}
      </div>
    );
  })}
  <div ref={chatEndRef} />
</div>

   {someoneTyping && (
  <div className="typing-indicator">📝 {someoneTyping} is typing...</div>
)}


  <div className="chat-input-container">
  <input
    type="text"
    value={inputMessage}
    onChange={handleInputChange}
    placeholder="Type a message..."
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
    className="chat-input"
  />
  <button onClick={sendMessage} className="send-button">Send</button>
</div>

</div>

      </div>
      </div>
    </div>
  );
}
