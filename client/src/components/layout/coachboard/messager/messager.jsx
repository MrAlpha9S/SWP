// This is the updated Messenger.jsx with typing indicator support
import React, { useEffect, useState, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ChatList from './chatlist';
import MessageBox from './messagebox';
import AllMembers from './allmembers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserConversations, GetMessageConversations, CreateConversation } from '../../../utils/messagerUtils';
import { GetAllMembers } from '../../../utils/userUtils';
import { getCurrentUTCDateTime } from '../../../utils/dateUtils';
import io from 'socket.io-client';

export default function Messenger({ role }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [messagesBoxSwitch, setMessagesBoxSwitch] = useState(1);
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [userStatuses, setUserStatuses] = useState({});
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [typingUser, setTypingUser] = useState();

  const { data: allMembers } = useQuery({
    queryKey: ['allMembers'],
    queryFn: async () => await GetAllMembers(user, getAccessTokenSilently, isAuthenticated),
    enabled: isAuthenticated && !!user,
  });

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  useEffect(() => {
    if (allMembers) setMembers(allMembers.data);
  }, [allMembers]);

  const { data: userConversations } = useQuery({
    queryKey: ['userConversations'],
    queryFn: async () => await GetUserConversations(user, getAccessTokenSilently, isAuthenticated),
    enabled: isAuthenticated && !!user,
  });

  const [selectedContactId, setSelectedContactId] = useState();
  const [contacts, setContacts] = useState();
  useEffect(() => {
    if (userConversations) {
      setSelectedContactId(userConversations.data[0]?.conversation_id);
      setContacts(userConversations.data);
    }
  }, [userConversations]);

  useEffect(() => {
    if (members.length && contacts) {
      const existingIds = contacts.map(c => c.other_participant_id);
      setFilteredMembers(members.filter(m => !existingIds.includes(m.auth0_id)));
    } else {
      setFilteredMembers(members);
    }
  }, [members, contacts]);

  const { data: messageConversations } = useQuery({
    queryKey: ['messageConversations'],
    queryFn: async () => await GetMessageConversations(user, getAccessTokenSilently, isAuthenticated),
    enabled: isAuthenticated && !!user,
  });

  const [allMessages, setAllMessages] = useState();
  useEffect(() => {
    if (messageConversations) setAllMessages(messageConversations.data);
  }, [messageConversations]);

  useEffect(() => {
  
    if (!socketRef.current && isAuthenticated && user) {
      socketRef.current = io("http://localhost:3001", {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        socketRef.current.emit('user_authenticate', {
          userId: user.sub,
          username: user.name,
          avatar: user.picture
        });
      });

      socketRef.current.on('online_users_list', (users) => {
        const usersMap = new Map(users.map(u => [u.userId, u]));
        setOnlineUsers(usersMap);
      });

      socketRef.current.on('user_status_update', (data) => {
        setOnlineUsers(prev => new Map(prev.set(data.userId, data.status)));
      });

      socketRef.current.on('typing', ({ conversationId, userId, username }) => {
        console.log('typing: ', conversationId, userId, username)
        setTypingUsers(prev => new Map(prev.set(conversationId, { userId, username })));
      });

      socketRef.current.on('stop_typing', ({ conversationId, userId }) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(conversationId);
          return newMap;
        });
      });

      socketRef.current.on('new_message', () => queryClient.invalidateQueries(['messageConversations']));
      socketRef.current.on('new_conversation', () => queryClient.invalidateQueries(['userConversations']));
      socketRef.current.on('conversation_updated', () => queryClient.invalidateQueries(['userConversations']));

      socketRef.current.on('member_interaction', (data) => {
        if (["conversation_created_successfully", "new_conversation_available"].includes(data.type)) {
          queryClient.invalidateQueries(['userConversations']);
          queryClient.invalidateQueries(['allMembers']);
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, queryClient]);

  // Typing User
  useEffect(() => {
    console.log(typingUsers)
    setTypingUser(typingUsers.get(selectedContactId));
  },[selectedContactId, typingUsers])

  useEffect(() => {
    if (socketRef.current && selectedContactId) {
      socketRef.current.emit('join_conversation', selectedContactId);
    }
  }, [selectedContactId, userConversations]);

  const onButtonClick = () => setMessagesBoxSwitch(2);
  const handleSelectConversation = (id) => {
    setMessagesBoxSwitch(1);
    setSelectedContactId(id);
  };

  const onSelectMember = async (id, name) => {
    const conversation_name = `${user.name} - ${name}`;
    const created_at = getCurrentUTCDateTime();
    const newConversation = await CreateConversation(user, getAccessTokenSilently, isAuthenticated, conversation_name, created_at, id);

    if (socketRef.current && newConversation) {
      socketRef.current.emit('new_conversation', {
        conversation: newConversation,
        participants: [user.sub, id]
      });
    }

    queryClient.invalidateQueries(['userConversations']);
    queryClient.invalidateQueries(['allMembers']);
    setMessagesBoxSwitch(1);
  };

  const emitMessage = (data) => socketRef.current?.emit('send_message', data);
  const emitConversationUpdate = (data) => socketRef.current?.emit('conversation_updated', data);
  const emitMemberInteraction = (data) => socketRef.current?.emit('member_interaction', data);

  if (!contacts || !allMessages) return <div>Loading...</div>;

  return (
    <div className="w-full flex h-screen bg-primary-700 rounded-lg text-white">
      <ChatList
        role={role}
        user={user.name}
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelect={handleSelectConversation}
        onButtonClick={onButtonClick}
        onEmitConversationUpdate={emitConversationUpdate}
        onlineUsers={onlineUsers}
        getUserOnlineStatus={(id) => onlineUsers.get(id)?.isOnline || false}
        getUserLastSeen={(id) => onlineUsers.get(id)?.lastSeen || null}
        formatLastSeen={(lastSeen) => {
          if (!lastSeen) return 'Never';
          const now = new Date();
          const diff = Math.floor((now - new Date(lastSeen)) / 60000);
          if (diff < 1) return 'Just now';
          if (diff < 60) return `${diff} min ago`;
          if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
          return `${Math.floor(diff / 1440)} day(s) ago`;
        }}
      />
      {messagesBoxSwitch === 2 ? (
        <AllMembers
          members={filteredMembers}
          onSelectMember={onSelectMember}
          onEmitMemberInteraction={emitMemberInteraction}
          onlineUsers={onlineUsers}
          getUserOnlineStatus={(id) => onlineUsers.get(id)?.isOnline || false}
          getUserLastSeen={(id) => onlineUsers.get(id)?.lastSeen || null}
          formatLastSeen={(lastSeen) => lastSeen}
        />
      ) : (
        <MessageBox
          messages={allMessages}
          conversation_id={selectedContactId}
          onEmitMessage={emitMessage}
          socket={socketRef.current}
          currentUser={user}
          typingUser={typingUser}
        />
      )}
    </div>
  );
}
