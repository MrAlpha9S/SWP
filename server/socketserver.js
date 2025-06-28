// server.js - Basic Socket.IO server setup
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active users and their socket connections
const activeUsers = new Map();
const conversationRooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user authentication and join
  socket.on('authenticate', (userData) => {
    socket.userId = userData.userId;
    socket.username = userData.username;
    
    activeUsers.set(userData.userId, {
      socketId: socket.id,
      username: userData.username,
      lastSeen: new Date()
    });

    console.log(`User ${userData.username} authenticated`);
  });

  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    
    // Track which conversations this socket is in
    if (!socket.conversations) {
      socket.conversations = new Set();
    }
    socket.conversations.add(conversationId);

    // Track users in conversation
    if (!conversationRooms.has(conversationId)) {
      conversationRooms.set(conversationId, new Set());
    }
    conversationRooms.get(conversationId).add(socket.userId);

    console.log(`User ${socket.username} joined conversation ${conversationId}`);
    
    // Notify other users in the conversation
    socket.to(conversationId).emit('user_joined', {
      userId: socket.userId,
      username: socket.username,
      conversationId
    });
  });

  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    
    if (socket.conversations) {
      socket.conversations.delete(conversationId);
    }

    if (conversationRooms.has(conversationId)) {
      conversationRooms.get(conversationId).delete(socket.userId);
    }

    console.log(`User ${socket.username} left conversation ${conversationId}`);
    
    // Notify other users in the conversation
    socket.to(conversationId).emit('user_left', {
      userId: socket.userId,
      username: socket.username,
      conversationId
    });
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, message, senderId } = data;
      
      console.log(`Message from ${socket.username} in conversation ${conversationId}:`, message);

      // Here you would typically save the message to your database
      // const savedMessage = await saveMessageToDatabase(message);

      // For now, we'll just broadcast the message with a timestamp
      const messageWithMetadata = {
        ...message,
        id: Date.now(), // In production, use proper ID from database
        timestamp: new Date().toISOString(),
        auth0_id: senderId,
        conversation_id: conversationId
      };

      // Broadcast to all users in the conversation
      io.to(conversationId).emit('new_message', messageWithMetadata);

      console.log(`Message broadcasted to conversation ${conversationId}`);

    } catch (error) {
      console.error('Error handling send_message:', error);
      socket.emit('message_error', {
        error: 'Failed to send message',
        originalMessage: data
      });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { conversationId, userId, username } = data;
    
    // Broadcast to other users in the conversation (not the sender)
    socket.to(conversationId).emit('user_typing', {
      userId,
      username,
      conversationId,
      isTyping: true
    });
  });

  socket.on('typing_stop', (data) => {
    const { conversationId, userId, username } = data;
    
    // Broadcast to other users in the conversation (not the sender)
    socket.to(conversationId).emit('user_typing', {
      userId,
      username,
      conversationId,
      isTyping: false
    });
  });

  // Handle message read status
  socket.on('mark_messages_read', (data) => {
    const { conversationId, messageIds, userId } = data;
    
    // Update read status in database
    // await markMessagesAsRead(messageIds, userId);
    
    // Broadcast read status to other users
    socket.to(conversationId).emit('messages_read', {
      messageIds,
      readBy: userId,
      readAt: new Date().toISOString()
    });
  });

  // Handle user status updates
  socket.on('update_status', (status) => {
    if (activeUsers.has(socket.userId)) {
      const user = activeUsers.get(socket.userId);
      user.status = status;
      user.lastSeen = new Date();
      
      // Broadcast status to user's conversations
      if (socket.conversations) {
        socket.conversations.forEach(conversationId => {
          socket.to(conversationId).emit('user_status_changed', {
            userId: socket.userId,
            username: socket.username,
            status,
            lastSeen: user.lastSeen
          });
        });
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.username} disconnected:`, socket.id);
    
    // Remove from active users
    if (socket.userId) {
      activeUsers.delete(socket.userId);
    }
    
    // Remove from conversation rooms
    if (socket.conversations) {
      socket.conversations.forEach(conversationId => {
        if (conversationRooms.has(conversationId)) {
          conversationRooms.get(conversationId).delete(socket.userId);
        }
        
        // Notify others that user has gone offline
        socket.to(conversationId).emit('user_offline', {
          userId: socket.userId,
          username: socket.username,
          lastSeen: new Date().toISOString()
        });
      });
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error for user', socket.username, ':', error);
  });
});

// API endpoint to get active users (optional)
app.get('/api/active-users', (req, res) => {
  const users = Array.from(activeUsers.entries()).map(([userId, userData]) => ({
    userId,
    ...userData
  }));
  res.json(users);
});

// API endpoint to get conversation participants (optional)
app.get('/api/conversations/:id/participants', (req, res) => {
  const conversationId = req.params.id;
  const participants = Array.from(conversationRooms.get(conversationId) || []);
  res.json(participants);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = { app, server, io };