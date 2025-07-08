import { create } from 'zustand';
import { io } from 'socket.io-client';

const useSocketStore = create((set, get) => ({
    socket: null,

    initSocket: (accessToken) => {
        const existing = get().socket;
        if (existing) return existing;

        const socket = io('http://localhost:3001', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: {
                token: accessToken,
            },
        });

        set({ socket });
        return socket;
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));

export default useSocketStore;
