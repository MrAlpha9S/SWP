// This is the updated Messenger.jsx with typing indicator support
import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ChatList from './chatlist';
import MessageBox from './messagebox';
import AllMembers from './allmembers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUserConversations, GetMessageConversations, CreateConversation } from '../../../utils/messagerUtils';
import { GetAllMembers } from '../../../utils/userUtils';
import { getCurrentUTCDateTime } from '../../../utils/dateUtils';
import {useOnlineUsersStore, useSocketStore} from "../../../../stores/useSocketStore.js";
import {useCoachInfoStore, useSelectedUserAuth0IdStore} from "../../../../stores/store.js";

export default function Messenger({ role }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [messagesBoxSwitch, setMessagesBoxSwitch] = useState(1);
  const { socket } = useSocketStore()
  const {onlineUsers, updateOnlineUser} = useOnlineUsersStore()
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [typingUser, setTypingUser] = useState();
  const {setSelectedUserAuth0Id, selectedUserAuth0Id} = useSelectedUserAuth0IdStore();
  const {coachInfo} = useCoachInfoStore()

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
      if (role === 'Member') {
        setSelectedUserAuth0Id(user?.user_sub)
        setSelectedContactId(userConversations.data[0]?.conversation_id);
      } else if (role !== 'Member') {
        if (!selectedUserAuth0Id || selectedUserAuth0Id.length === 0) {
          setSelectedUserAuth0Id(userConversations.data[0]?.other_participant_id);
          setSelectedContactId(userConversations.data[0]?.conversation_id);
        } else if (selectedUserAuth0Id?.length > 0) {
          console.log(selectedUserAuth0Id);
          const conversation_id = userConversations.data?.find((entry) => entry.other_participant_id === selectedUserAuth0Id).conversation_id;
          console.log('conversation_id', conversation_id);
          setSelectedContactId(conversation_id);
        }

      }
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
    if (socket && user && isAuthenticated) {

      socket.on('user_status_update', (data) => {
        updateOnlineUser(data.userId, data.status)
      });

      socket.on('typing', ({ conversationId, userId, username }) => {
        setTypingUsers(prev => new Map(prev.set(conversationId, { userId, username })));
      });

      socket.on('stop_typing', ({ conversationId, userId }) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(conversationId);
          return newMap;
        });
      });


      socket.on('new_conversation', () => queryClient.invalidateQueries(['userConversations']));
      socket.on('conversation_updated', () => queryClient.invalidateQueries(['userConversations']));

      socket.on('member_interaction', (data) => {
        if (["conversation_created_successfully", "new_conversation_available"].includes(data.type)) {
          queryClient.invalidateQueries(['userConversations']);
          queryClient.invalidateQueries(['allMembers']);
        }
      });
    }
  }, [isAuthenticated, user, queryClient]);

  // Typing User
  useEffect(() => {
    setTypingUser(typingUsers.get(selectedContactId));
  },[selectedContactId, typingUsers])

  useEffect(() => {
    if (socket && selectedContactId) {
      socket.emit('join_conversation', selectedContactId);
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

    if (socket && newConversation) {
      socket.emit('new_conversation', {
        conversation: newConversation,
        participants: [user.sub, id]
      });
    }

    queryClient.invalidateQueries(['userConversations']);
    queryClient.invalidateQueries(['allMembers']);
    setMessagesBoxSwitch(1);
  };

  const emitMessage = (data) => socket?.emit('send_message', data);
  const emitConversationUpdate = (data) => socket?.emit('conversation_updated', data);
  const emitMemberInteraction = (data) => socket?.emit('member_interaction', data);

  if (!contacts || !allMessages) return <div>Loading...</div>;

  return (
    <div className="w-[650px] h-[calc(100vh-250px)] flex bg-primary-700 rounded-lg text-white">
      <ChatList
        role={role}
        user={user.name}
        contacts={contacts}
        selectedContactId={selectedContactId}
        onSelect={handleSelectConversation}
        onButtonClick={onButtonClick}
        onEmitConversationUpdate={emitConversationUpdate}
        onlineUsers={onlineUsers}
        getUserOnlineStatus={(id) => onlineUsers?.get(id)?.isOnline || false}
        getUserLastSeen={(id) => onlineUsers?.get(id)?.lastSeen || null}
        formatLastSeen={(lastSeen) => {
          if (!lastSeen) return 'Never';
          const now = new Date();
          const diff = Math.floor((now - new Date(lastSeen)) / 60000);
          if (diff < 1) return 'Vừa mới đăng nhập';
          if (diff < 60) return `${diff}p trước`;
          if (diff < 1440) return `${Math.floor(diff / 60)}h trước`;
          return `${Math.floor(diff / 1440)} ngày trước`;
        }}
      />
      {messagesBoxSwitch === 2 ? (
        <AllMembers
          members={filteredMembers}
          onSelectMember={onSelectMember}
          onEmitMemberInteraction={emitMemberInteraction}
          onlineUsers={onlineUsers}
          getUserOnlineStatus={(id) => onlineUsers?.get(id)?.isOnline || false}
          getUserLastSeen={(id) => onlineUsers?.get(id)?.lastSeen || null}
          formatLastSeen={(lastSeen) => lastSeen}
        />
      ) : (
        <MessageBox
          messages={allMessages}
          conversation_id={selectedContactId}
          onEmitMessage={emitMessage}
          socket={socket}
          currentUser={user}
          contacts={contacts}
          typingUser={typingUser}
        />
      )}
    </div>
  );
}
