import React from 'react';
import { Avatar } from 'antd';

export default function ChatList({ contacts, selectedContactId, onSelect }) {
  return (
    <div className="w-1/4 border-r border-gray-800 p-4">
      <div className="text-xl font-bold mb-4">ltbut28</div>
      <div className="space-y-4">
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
              c.id === selectedContactId ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <Avatar>{c.img}</Avatar>
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-gray-400">Active recently</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
