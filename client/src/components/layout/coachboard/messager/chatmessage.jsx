import React from 'react';

export default function ChatMessage({ message }) {
  const isMe = message.from === 'me';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-2 rounded-xl ${
          isMe ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
        } whitespace-pre-line`}
      >
        {message.text}
      </div>
    </div>
  );
}
