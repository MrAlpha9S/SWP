import React, { useEffect, useState, useRef } from 'react';
import { Input } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";
import ChatMessage from './ChatMessage';
import { SendOutlined } from '@ant-design/icons';
import { SendMessage } from '../../../utils/messagerUtils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUTCDateTime } from '../../../utils/dateUtils'

const { TextArea } = Input;

export default function MessageBox({ messages, conversation_id, onEmitMessage }) {
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const conversationId = conversation_id;

  const sendMessageMutation = useMutation({
    mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at }) => {
      return await SendMessage(user, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at);
    },
    onSuccess: (data) => {
      console.log('Message sent successfully');
      // Emit message to socket for real-time updates through parent component
      if (onEmitMessage) {
        onEmitMessage({
          conversationId,
          message: data
        });
      }
      queryClient.invalidateQueries({ queryKey: ['messageConversations'] });
      // Clear input after successful send
      setInput('');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    },
  });

  const handleOnSend = () => {
    if (!input || input.trim() === '') return;
    
    const message = {
      conversationId: conversationId,
      content: input.trim(),
      created_at: getCurrentUTCDateTime()
    };
    
    console.log('Sending message:', message);
    sendMessageMutation.mutate({ user, getAccessTokenSilently, isAuthenticated, ...message });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleOnSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 h-full">
      <div className="flex-1 overflow-y-auto space-y-2 pr-4 mb-4">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <ChatMessage 
              key={msg.id || idx} 
              user={user} 
              message={msg} 
              conversation_id={conversation_id} 
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t pt-4">
        <div className="flex items-end gap-2">
          <TextArea
            rows={1}
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="text-black flex-1"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={handleOnSend}
            disabled={sendMessageMutation.isPending || !input.trim()}
            className={`p-2 rounded-full transition-colors ${
              sendMessageMutation.isPending || !input.trim()
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-primary-600 hover:text-primary-700 cursor-pointer'
            }`}
          >
            <SendOutlined className="text-xl" />
          </button>
        </div>
        
        {sendMessageMutation.isPending && (
          <div className="text-sm text-gray-500 mt-2">
            Sending message...
          </div>
        )}
      </div>
    </div>
  );
}