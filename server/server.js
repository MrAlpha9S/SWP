require('dotenv').config({ path: `.env` });
const express = require('express');
const app = express();
const http = require('http');
const Server = require('socket.io');
const port = 3000;
const portSocket = 3001; // Port for Socket.IO server
const cors = require('cors');
const socket = require('./utils/socket');

app.use(cors());
app.use(express.json());

const userRouter = require("./routes/userRoute");
const profileRouter = require("./routes/profileRoute");
const topicRouter = require("./routes/topicRoute");
const checkInRouter = require("./routes/checkInRoute");
const socialPostRouter = require("./routes/socialPostRoute");
const messageRouter = require("./routes/messageRoute");
const subscriptionRouter = require("./routes/subscriptionRoute");
const paymentRouter = require("./routes/paymentRoute");
const coachRouter = require("./routes/coachRoute");
const achievementRouter = require("./routes/achievementRoute");
const reportRouter = require("./routes/reportRoute")

const server = http.createServer(app);

const io = socket.init(server);

// Store online users with their socket IDs and user info
const onlineUsers = new Map();

// Store typing users by conversation ID
const typingUsers = new Map();

// Helper function to get online status for multiple users
const getOnlineStatus = (userIds) => {
    const statusMap = {};
    userIds.forEach(userId => {
        statusMap[userId] = {
            isOnline: onlineUsers.has(userId),
            lastSeen: onlineUsers.get(userId)?.lastSeen || null
        };
    });
    return statusMap;
};

// Helper function to broadcast online status update
const broadcastUserStatus = (userId, status) => {
    io.emit('user_status_update', {
        userId,
        status,
        timestamp: new Date().toISOString()
    });
};

// Helper function to clean up typing status
const cleanupTypingStatus = (conversationId, userId) => {
    const typingInConversation = typingUsers.get(conversationId);
    if (typingInConversation && typingInConversation.has(userId)) {
        typingInConversation.delete(userId);
        if (typingInConversation.size === 0) {
            typingUsers.delete(conversationId);
        }
    }
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userAuth0Id = socket.user.sub
    socket.join(userAuth0Id)

    // Handle user authentication and online status
    socket.on('user_authenticate', (userData) => {
        const { userId, username, avatar } = userData;

        // Store user info with socket
        socket.userId = userId;
        socket.username = username;

        // Add to online users map
        onlineUsers.set(userId, {
            socketId: socket.id,
            username,
            avatar,
            lastSeen: new Date().toISOString(),
            isOnline: true
        });

        console.log(`User ${username} (${userId}) is now online`);

        // Broadcast user coming online
        broadcastUserStatus(userId, {
            isOnline: true,
            username,
            avatar,
            lastSeen: new Date().toISOString()
        });

        // Send current online users to the newly connected user
        const onlineUsersList = Array.from(onlineUsers.entries()).map(([id, info]) => ({
            userId: id,
            username: info.username,
            avatar: info.avatar,
            isOnline: info.isOnline,
            lastSeen: info.lastSeen
        }));

        socket.emit('online_users_list', onlineUsersList);
    });

    // Handle request for specific users' online status
    socket.on('get_users_status', (userIds) => {
        const statusMap = getOnlineStatus(userIds);
        socket.emit('users_status_response', statusMap);
    });

    // Handle joining conversation rooms
    socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`);
        console.log(`User ${socket.id} left conversation ${conversationId}`);

        // Clean up typing status when leaving conversation
        if (socket.userId) {
            cleanupTypingStatus(conversationId, socket.userId);
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        // console.log(data)
        const { conversationId, userId, username } = data;

        // Initialize typing users for this conversation if not exists
        if (!typingUsers.has(conversationId)) {
            typingUsers.set(conversationId, new Map());
        }

        // Add user to typing users
        typingUsers.get(conversationId).set(userId, {
            username,
            timestamp: new Date().toISOString()
        });

        // Broadcast typing indicator to other users in the conversation
        socket.to(`conversation_${conversationId}`).emit('typing', {
            conversationId,
            userId,
            username
        });
        // socket.emit('typing', {
        //     conversationId,
        //     userId,
        //     username
        // });
    });

    // Handle stop typing indicator
    socket.on('stop_typing', (data) => {
        const { conversationId, userId } = data;

        console.log(`User ${userId} stopped typing in conversation ${conversationId}`);

        // Remove user from typing users
        cleanupTypingStatus(conversationId, userId);

        // Broadcast stop typing indicator to other users in the conversation
        socket.emit('stop_typing', {
            conversationId,
            userId
        });
    });

    socket.on('send_message', (data) => {
        console.log('Message received:', data);

        if (socket.userId) {
            cleanupTypingStatus(data.conversationId, socket.userId);
            socket.to(`conversation_${data.conversationId}`).emit('stop_typing', {
                conversationId: data.conversationId,
                userId: socket.userId
            });
        }

        socket.to(`conversation_${data.conversationId}`).emit('new_message', data);
        socket.emit('message_sent', data);
    });

    // Handle new conversation creation
    socket.on('new_conversation', (data) => {
        console.log('New conversation created:', data);
        if (data.participants && data.participants.length > 0) {
            data.participants.forEach(participantId => {
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

        // Handle user going offline
        if (socket.userId) {
            const userData = onlineUsers.get(socket.userId);
            if (userData) {
                // Clean up typing status for all conversations this user was typing in
                typingUsers.forEach((typingInConversation, conversationId) => {
                    if (typingInConversation.has(socket.userId)) {
                        // Broadcast stop typing to the conversation
                        socket.to(`conversation_${conversationId}`).emit('stop_typing', {
                            conversationId,
                            userId: socket.userId
                        });

                        // Remove from typing users
                        cleanupTypingStatus(conversationId, socket.userId);
                    }
                });

                // Update user status to offline
                onlineUsers.set(socket.userId, {
                    ...userData,
                    isOnline: false,
                    lastSeen: new Date().toISOString()
                });

                // Broadcast user going offline
                broadcastUserStatus(socket.userId, {
                    isOnline: false,
                    username: userData.username,
                    avatar: userData.avatar,
                    lastSeen: new Date().toISOString()
                });

                // Remove from online users after a delay (to handle quick reconnections)
                setTimeout(() => {
                    const currentUser = onlineUsers.get(socket.userId);
                    if (currentUser && !currentUser.isOnline) {
                        onlineUsers.delete(socket.userId);
                    }
                }, 30000); // 30 seconds delay
            }
        }
    });
});

app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/topics', topicRouter);
app.use('/check-in', checkInRouter)
app.use('/social-posts', socialPostRouter)
app.use('/messager', messageRouter)
app.use('/subscription', subscriptionRouter)
app.use('/payment', paymentRouter)
app.use('/coaches', coachRouter)
app.use('/achievements', achievementRouter)
app.use('/reports', reportRouter)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

server.listen(portSocket, () => {
    console.log(`Socket.IO server running at http://localhost:${portSocket}`);
});

module.exports = { io }