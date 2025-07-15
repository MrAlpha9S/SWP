let io = null;

module.exports = {
    init: (server) => {
        const socketIo = require('socket.io');
        io = socketIo(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        const socketJwtMiddleware = require('../middlewares/socketAuth');
        socketJwtMiddleware(io);

        return io;
    },

    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
