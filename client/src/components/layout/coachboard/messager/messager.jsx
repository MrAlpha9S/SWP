import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ChatList from './chatlist';
import MessageBox from './messagebox';
import { useQuery } from '@tanstack/react-query'
import { GetUserConversations, GetMessageConversations } from '../../../utils/messagerUtils';

export default function Messenger() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  // Message Conversation
  const {
    isPending: isMessageConversationsPending,
    data: messageConversations,
  } = useQuery({
    queryKey: ['messageConversations'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return;
      return await GetMessageConversations(user, getAccessTokenSilently, isAuthenticated);
    },
    enabled: isAuthenticated && !!user,
  })

  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    if (!isMessageConversationsPending && messageConversations) {
      setAllMessages(messageConversations.data)
    }
  }, [isMessageConversationsPending, messageConversations]);
  // User Conversations
  const {
    isPending: isUserConversationsPending,
    data: userConversations,
  } = useQuery({
    queryKey: ['userConversations'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return;
      return await GetUserConversations(user, getAccessTokenSilently, isAuthenticated);
    },
    enabled: isAuthenticated && !!user,
  })

  const [selectedContactId, setSelectedContactId] = useState(undefined);
  const [contacts, setContacts] = useState();
  useEffect(() => {
    if (!isUserConversationsPending && userConversations) {
      setSelectedContactId(userConversations.data[0]?.conversation_id);
      setContacts(userConversations.data);
    }
  }, [isUserConversationsPending, userConversations]);



  const handleSelectConversation = (id) => {
    setSelectedContactId(id); //
  };

  if (isMessageConversationsPending || isUserConversationsPending || !contacts || !selectedContactId || !allMessages) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex h-screen bg-primary-700 rounded-lg text-white">
      <ChatList
        user={user.name}
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelect={handleSelectConversation}
      />
      <MessageBox messages={allMessages} conversation_id={selectedContactId}/>
    </div>
  );
}