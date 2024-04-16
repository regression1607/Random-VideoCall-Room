const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); 
// Get the saved API and key from the session storage
require('dotenv').config();
const app = express();
app.use(express.json());
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "https://random-video-call-room-server.vercel.app",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

const mongoose = require('mongoose');
app.use(cors());
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const Room = mongoose.model('Room', new mongoose.Schema({
  roomId: String
}));


app.post('/room', async (req, res) => {
  const apiKey = req.body.apiKey;
  const roomId = Math.floor(1000 + Math.random() * 9000);
  const room = new Room({ roomId: roomId });
  await room.save();
  console.log("apiKey", apiKey);

  // Create a new Daily.co room
  const dailyRes = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ name: roomId.toString() })
  });

  if (!dailyRes.ok) {
    // Handle error
    res.status(500).json({ error: 'Failed to create room' });
    return;
  }

  res.json({ roomId: room.roomId });
});

app.get('/room/:roomId/join', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  console.log("room id join button clicked",room);
  if (room) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

io.on('connection', socket => {
  socket.on('joinRoom', roomId => {
    socket.join(roomId);
  });
});

server.listen(5000);
