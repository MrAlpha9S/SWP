import React from 'react';
import { Avatar } from 'antd';

export default function ChatMessage({ user, message, conversation_id }) {
  if (message.conversation_id != conversation_id) return;
  const auth0_id = user.sub;

  return (
    <div className={`flex ${message.auth0_id === auth0_id ? 'justify-end' : 'justify-start'}`}>

      <div
        className={`max-w-xs p-2 rounded-xl ${message.auth0_id === auth0_id ? 'bg-primary-500 text-white' : 'bg-gray-700 text-white'
          } whitespace-pre-line`}
      >
        {message.content}
      </div>
    </div>
  );
}
