import React from 'react';
import { Input } from 'antd';
import ChatMessage from './ChatMessage';

const { TextArea } = Input;

export default function MessageBox({ messages }) {
  return (
    <div className="flex-1 flex flex-col justify-between p-4">
      <div className="overflow-y-auto space-y-2 pr-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>
      <div className="mt-4">
        <TextArea rows={1} className="bg-gray-800 text-white" placeholder="Message..." />
      </div>
    </div>
  );
}
