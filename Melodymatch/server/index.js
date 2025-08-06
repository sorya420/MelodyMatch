
const PORT = process.env.PORT || 8000;

const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const uri = process.env.URI;
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  
  "http://localhost:3000",
  "https://melody-match-3wi6.onrender.com"
];

// For REST API
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS error"));
    }
  },
  credentials: true
}));

// For Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO CORS error"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(express.json());






// 🔐 Auth + User Routes (your original code)
app.get("/", (req, res) => {
  res.json("hello to my app ");
});

app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(409).send("User already exists. Please login");

    const sanitizedEmail = email.toLowerCase();
    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);
    const token = jwt.sign(insertedUser, sanitizedEmail, { expiresIn: 60 * 24 });
    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    (err);
  } finally {
    await client.close();
  }
});

app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const user = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(password, user?.hashed_password || "");

    if (user && correctPassword) {
      const token = jwt.sign(user, email, { expiresIn: 60 * 24 });
      return res.status(201).json({ token, userId: user.user_id });
    }

    res.status(400).json("Invalid Credentials");
  } catch (err) {
    (err);
  } finally {
    await client.close();
  }
});

app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const user = await users.findOne({ user_id: userId });
    res.send(user);
  } finally {
    await client.close();
  }
});

app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // ✅ Add matched user to current user's matches
    await users.updateOne(
      { user_id: userId },
      { $addToSet: { matches: { user_id: matchedUserId } } } // use $addToSet to avoid duplicates
    );

    res.send("Match added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding match");
  } finally {
    await client.close();
  }
});

app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const foundUsers = await users
      .find({ user_id: { $in: userIds } })
      .toArray(); // ✅ return full user object

    res.json(foundUsers);
  } finally {
    await client.close();
  }
});


// app.get("/gendered-users", async (req, res) => {
//   const client = new MongoClient(uri);
//   const gender = req.query.gender;

//   try {
//     await client.connect();
//     const database = client.db("app-data");
//     const users = database.collection("users");

//     const foundUsers = await users.find({ gender_identity: gender }).toArray();
//     res.json(foundUsers);
//   } finally {
//     await client.close();
//   }
// });
app.get("/gendered-users", async (req, res) => {
  const client = new MongoClient(uri);
  const { gender, userId } = req.query;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // Get current user
    const currentUser = await users.findOne({ user_id: userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const potentialMatches = await users.find({
      gender_identity: gender,
      user_id: { $ne: userId } // Exclude self
    }).toArray();

    const matchedUsers = potentialMatches.map((user) => {
  let score = 0;

  const commonSongs = currentUser.favoriteSongs?.filter(song =>
  user.favoriteSongs?.some(uSong => uSong.toLowerCase() === song.toLowerCase())
) || [];

const commonArtists = currentUser.favoriteArtists?.filter(artist =>
  user.favoriteArtists?.some(uArtist => uArtist.toLowerCase() === artist.toLowerCase())
) || [];

const commonGenres = currentUser.musicPreferences?.filter(genre =>
  user.musicPreferences?.some(uGenre => uGenre.toLowerCase() === genre.toLowerCase())
) || [];


  if (commonSongs.length > 0) score++;
  if (commonArtists.length > 0) score++;
  if (commonGenres.length > 0) score++;

  if (score >= 2) {
    return {
      ...user,
      commonSongs,
      commonArtists,
      commonGenres,
    };
  }
}).filter(Boolean); // remove undefined


    res.send(matchedUsers);
  } finally {
    await client.close();
  }
});


app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
     favoriteSongs: Array.isArray(formData.favoriteSongs)
  ? formData.favoriteSongs.map(s => s.toLowerCase())
  : [],
favoriteArtists: Array.isArray(formData.favoriteArtists)
  ? formData.favoriteArtists.map(a => a.toLowerCase())
  : [],
musicPreferences: Array.isArray(formData.musicPreferences)
  ? formData.musicPreferences.map(g => g.toLowerCase())
  : []

      }
    };

    ("Updating user:", query);
    ("Update doc:", updateDocument);

    const result = await users.updateOne(query, updateDocument, {
      upsert: true
    });

    res.json(result);
  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});



// app.get("/messages", async (req, res) => {
//   const client = new MongoClient(uri);
//   const { userId, correspondingUserId } = req.query;

//   try {
//     await client.connect();
//     const database = client.db("app-data");
//     const messages = database.collection("messages");

//     const query = { from_userId: userId, to_userId: correspondingUserId };
//     const foundMessages = await messages.find(query).toArray();
//     res.send(foundMessages);
//   } finally {
//     await client.close();
//   }
// });

app.get("/messages", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, correspondingUserId } = req.query;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const query = {
      $or: [
        { from_userId: userId, to_userId: correspondingUserId },
        { from_userId: correspondingUserId, to_userId: userId }
      ]
    };

    const foundMessages = await messages.find(query).sort({ timestamp: 1 }).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});



// io.on("connection", (socket) => {
//   ("User connected:", socket.id);


// socket.on("sendMessage", (msgObj) => {
//   io.emit("receiveMessage", msgObj);
// });


//   socket.on("disconnect", () => {
//     ("User disconnected:", socket.id);
//   });
// });





// io.on("connection", (socket) => {
//   ("User connected");

//   socket.on("join_room", (room) => {
//     socket.join(room);
//     (`User joined room: ${room}`);
//   });

//   socket.on("send_message", (data) => {
//     io.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     ("User disconnected");
//   });
// });

io.on("connection", (socket) => {
  ("🟢 User connected:", socket.id);

  // 🗨️ Chat message logic
  socket.on("sendMessage", (msgObj) => {
    io.emit("receiveMessage", msgObj);
  });

  // 💬 Match-based chat room (1-1)
  socket.on("join_room", (room) => {
    socket.join(room);
    (`User joined chat room: ${room}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  // 🎵 Group music room logic
  socket.on("join_music_room", (roomId) => {
    socket.join(roomId);
    (`User ${socket.id} joined music room ${roomId}`);
  });

  socket.on("play_track", ({ roomId, uri }) => {
    socket.to(roomId).emit("play_track", uri);
    (`Track played in room ${roomId}: ${uri}`);
  });

  socket.on("pause_track", (roomId) => {
    socket.to(roomId).emit("pause_track");
    (`Track paused in room ${roomId}`);
  });

  // Optional: sync seek position
  socket.on("sync_seek", ({ roomId, position_ms }) => {
    socket.to(roomId).emit("sync_seek", position_ms);
  });

  socket.on("disconnect", () => {
    ("🔴 User disconnected:", socket.id);
  });
});

io.on("connection", (socket) => {
  console.log("🧑‍💻 User connected:", socket.id);

  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg); // send to others
  });

  socket.on("sync-play", (data) => {
    socket.broadcast.emit("sync-play", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});








server.listen(PORT, () => (`Server running on http://localhost:${PORT}`));

