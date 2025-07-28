import { create } from 'zustand';
import { io } from 'socket.io-client';
import {getWebSocketUrl} from "../components/utils/getBackendURL.js";

export const useSocketStore = create((set, get) => ({
    socket: null,

    initSocket: (accessToken) => {
        const existing = get().socket;
        if (existing) return existing;

        const socket = io(`${getWebSocketUrl}`, {
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

export const useOnlineUsersStore = create((set) => ({
    onlineUsers: new Map(),

    setOnlineUsers: (map) => {
        if (!(map instanceof Map)) {
            console.log('error map:', map)
            console.log('error type:', typeof map);
            throw new TypeError('setOnlineUsers expects a Map');
        }
        set({ onlineUsers: new Map(map) });
    },

    updateOnlineUser: (userId, userData) =>
        set((state) => {
            const updated = new Map(state.onlineUsers);
            updated.set(userId, userData);
            return { onlineUsers: updated };
        }),

    removeOnlineUser: (userId) =>
        set((state) => {
            const updated = new Map(state.onlineUsers);
            updated.delete(userId);
            return { onlineUsers: updated };
        }),
}));


