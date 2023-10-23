require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
      origin: '*',
    }
});
const path = require('path');
const cors = require('cors');

app.use(cors());


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {

  console.log(__dirname + '/public');
    
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const objectCreateChannelName = process.env.OBEJECT_CREATE_CHANNEL_NAME
const objectUpdateChannelName = process.env.OBEJECT_UPDATE_CHANNEL_NAME

if (!objectCreateChannelName || !objectUpdateChannelName) {
  console.log("Set OBEJECT_CREATE_CHANNEL_NAME and OBEJECT_UPDATE_CHANNEL_NAME in your environment")
  process.exit();
}

io.on('connection', (socket) => {
  console.log('A user connected.');

  socket.on(objectCreateChannelName, (data) => {
    // Handle new JSON object here
    console.log('Received new object:', data);
    // Broadcast the new object to all connected clients
    io.emit(objectCreateChannelName, data);
  });

  socket.on(objectUpdateChannelName, (data) => {
    // Handle updated JSON object here
    console.log('Received updated object:', data);
    // Broadcast the updated object to all connected clients
    io.emit(objectUpdateChannelName, data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
