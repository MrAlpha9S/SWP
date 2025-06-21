import React from 'react';

export default function ChatMessage({ message, conversation_id, auth0_id }) {
  if(message.conversation_id != conversation_id) return;

  return (
    <div className={`flex ${message.auth0_id === auth0_id ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-2 rounded-xl ${
          message.auth0_id === auth0_id ? 'bg-primary-500 text-white' : 'bg-gray-700 text-white'
        } whitespace-pre-line`}
      >
        {message.content}
      </div>
    </div>
  );
}
