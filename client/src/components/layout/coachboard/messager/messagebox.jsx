import React, { useState } from 'react';
import { Input } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";
import ChatMessage from './ChatMessage';
import { SendOutlined } from '@ant-design/icons';
import { SendMessage } from '../../../utils/messagerUtils';
import { useMutation } from '@tanstack/react-query';
import { getCurrentUTCDateTime } from '../../../utils/dateUtils'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


const { TextArea } = Input;

export default function MessageBox({ messages }) {
  const [input, setInput] = useState();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const conversationId = 4;

  const sendMessageMutation = useMutation({
    mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at }) => {
      return await SendMessage(user, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at);
    },
    onSuccess: () => {

    },
    onError: () => {

    },
  });

  const handleOnSend = () => {
    if (!input || input === '') return;
    const message = {
      conversationId: conversationId,
      content: input,
      created_at: getCurrentUTCDateTime()
    }
    console.log('Submit:', message)
    sendMessageMutation.mutate({ user, getAccessTokenSilently, isAuthenticated, ...message })
  }
  return (
    <div className="flex-1 flex flex-col justify-between p-4">
      <div className="overflow-y-auto space-y-2 pr-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TextArea
          rows={1}
          className="text-black flex-1"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <SendOutlined onClick={handleOnSend} className="text-2xl text-primary-600 cursor-pointer" />
      </div>
    </div>
  );
}
