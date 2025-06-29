require('dotenv').config({path: `.env`});
const express = require('express');
const app = express();
const http = require('http');
const Server = require('socket.io');
const port = 3000;
const portSocket = 3001; // Port for Socket.IO server
const cors = require('cors');

app.use(cors());
app.use(express.json());

const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const topicRouter = require("./routes/topicRoute");
const checkInRouter = require("./routes/checkInRoute");
const socialPostRouter = require("./routes/socialPostRoute");
const messageRouter = require("./routes/messageRoute");

const server = http.createServer(app);

const io = Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        io.emit('new_message', data);
    });
});

app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/topics', topicRouter);
app.use('/check-in', checkInRouter)
app.use('/social-posts', socialPostRouter)
app.use('/messager', messageRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

server.listen(portSocket, () => {
    console.log(`Socket.IO server running at http://localhost:${portSocket}`);
});