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
    
    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
        console.log(`User ${socket.id} left conversation ${conversationId}`);
    });
    
    // Handle sending messages
    socket.on('send_message', (data) => {
        console.log('Message received:', data);
        // Emit to specific conversation room
        socket.to(`conversation_${data.conversationId}`).emit('new_message', data);
        // Also emit to sender for confirmation
        socket.emit('message_sent', data);
    });

    // Handle new conversation creation
    socket.on('new_conversation', (data) => {
        console.log('New conversation created:', data);
        // Emit to all participants
        if (data.participants && data.participants.length > 0) {
            data.participants.forEach(participantId => {
                // In a real application, you'd need to map user IDs to socket IDs
                // For now, broadcast to all connected clients
                io.emit('new_conversation', data);
            });
        }
    });

    // Handle conversation updates (like when conversation list needs refresh)
    socket.on('conversation_updated', (data) => {
        console.log('Conversation updated:', data);
        // Broadcast conversation update to all relevant users
        if (data.conversationId) {
            socket.to(`conversation_${data.conversationId}`).emit('conversation_updated', data);
        } else {
            // If no specific conversation, broadcast to all
            socket.broadcast.emit('conversation_updated', data);
        }
    });

    // Handle member interactions (selection, conversation creation, etc.)
    socket.on('member_interaction', (data) => {
        console.log('Member interaction:', data);
        
        switch (data.type) {
            case 'member_selected':
                // Broadcast member selection to other users (for presence/activity indicators)
                socket.broadcast.emit('member_interaction', {
                    type: 'member_being_selected',
                    memberId: data.memberId,
                    memberName: data.memberName,
                    byUser: socket.id,
                    timestamp: data.timestamp
                });
                break;
                
            case 'conversation_creation_started':
                // Notify other users that a conversation is being created
                socket.broadcast.emit('member_interaction', {
                    type: 'conversation_creation_in_progress',
                    memberId: data.memberId,
                    memberName: data.memberName,
                    byUser: socket.id,
                    timestamp: data.timestamp
                });
                break;
                
            case 'conversation_created_successfully':
                // Broadcast successful conversation creation
                io.emit('member_interaction', {
                    type: 'new_conversation_available',
                    memberId: data.memberId,
                    memberName: data.memberName,
                    byUser: socket.id,
                    timestamp: data.timestamp
                });
                // Also trigger conversation list refresh
                io.emit('conversation_updated', {
                    type: 'conversation_list_refresh',
                    timestamp: data.timestamp
                });
                break;
                
            case 'conversation_creation_failed':
                // Log error and potentially notify relevant users
                console.error('Conversation creation failed:', data.error);
                socket.emit('member_interaction', {
                    type: 'conversation_creation_error',
                    error: data.error,
                    timestamp: data.timestamp
                });
                break;
                
            default:
                // Handle other member interaction types
                socket.broadcast.emit('member_interaction', data);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
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