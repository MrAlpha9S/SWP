import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ChatList from './chatlist';
import MessageBox from './messagebox';
import { useQuery } from '@tanstack/react-query'
import { GetUserConversations, GetMessageConversations } from '../../../utils/messagerUtils';

// const contacts = [
//   { id: 1, name: 'trung úy gấu gấu 🐶', img: '🐻' },
//   { id: 2, name: 'cusibudi', img: '📸' },
//   { id: 3, name: 'x_xlirin24', img: '👤' },
//   { id: 4, name: 'draculez ☆ ☆ ☆', img: '🐱' },
// ];

// Dummy messages for each contact
// const allMessages = {
//   1: [
//     { from: 'them', text: 'hey 🐶' },
//     { from: 'me', text: 'hi!' }
//   ],
//   2: [{ from: 'them', text: 'what’s up 📸' }],
//   3: [
//     { from: 'them', text: 'Hơn tháng rồi con tó' },
//     { from: 'me', text: '😬\nit dùng insta' },
//     { from: 'me', text: 't sống chủ yếu ở discord' },
//     { from: 'them', text: 'Vãi cức\nSài mà không biết là gì\n:))' },
//   ],
//   4: [{ from: 'them', text: 'meow 🐱' }],
// };

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
      console.log(userConversations.data);
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