import React from 'react';
import { Avatar } from 'antd';

export default function ChatMessage({ user, message, conversation_id }) {
    if (message.conversation_id !== conversation_id) return null;

    const auth0_id = user.sub;
    const isMine = message.auth0_id === auth0_id;

    return (
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <div className="text-xs text-gray-400 mb-1">{message.username}</div>
                <div
                    className={`p-2 rounded-xl whitespace-pre-line break-words max-w-[60%] w-fit text-sm ${
                        isMine ? 'bg-primary-500 text-white' : 'bg-gray-700 text-white'
                    }`}
                >
                    {message.content}
                </div>
            </div>
        </div>
    );
}
