import React from 'react';

export default function ChatList({ user, contacts, selectedContactId, onSelect }) {
  return (
    <div className="w-1/4 border-r border-gray-800 p-4">
      <div className="text-xl font-bold mb-4">{user}</div>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div
            key={c.conversation_id}
            onClick={() => onSelect(c.conversation_id)}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
              c.conversation_id === selectedContactId ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <div>
              <div className="font-semibold">{c.conversation_name}</div>
              <div className="text-xs text-gray-400">Active recently</div>
            </div>
          </div>
        ))}
        <div
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-800`}
          >
          <div>
            <div className="font-semibold">New Conversation</div>
            <div className="text-xs text-gray-400">Start a new chat</div>
          </div>
      </div>
    </div></div>
  );
}
