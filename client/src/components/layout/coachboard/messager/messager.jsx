import React, { useEffect, useState, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ChatList from './chatlist';
import MessageBox from './messagebox';
import AllMembers from './allmembers';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GetUserConversations, GetMessageConversations, CreateConversation } from '../../../utils/messagerUtils';
import { GetAllMembers } from '../../../utils/userUtils';
import { getCurrentUTCDateTime } from '../../../utils/dateUtils';
import io from 'socket.io-client';

export default function Messenger({ role }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [messagesBoxSwitch, setMessagesBoxSwitch] = useState(1);
  const socketRef = useRef(null);

  // All Members
  const {
    isPending: isAllMembersPending,
    data: allMembers,
  } = useQuery({
    queryKey: ['allMembers'],
    queryFn: async () => {
      if (!isAuthenticated || !user) return;
      return await GetAllMembers(user, getAccessTokenSilently, isAuthenticated);
    },
    enabled: isAuthenticated && !!user,
  })

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (!isAllMembersPending && allMembers) {
      console.log(allMembers.data);
      setMembers(allMembers.data)
    }
  }, [isAllMembersPending, allMembers]);
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

  // Filter out members who already have conversations
  useEffect(() => {
    if (members.length > 0 && contacts) {
      const existingConversationMemberIds = contacts.map(contact => {
        return contact.other_participant_id; 
      }).filter(Boolean);
      const availableMembers = members.filter(member =>
        !existingConversationMemberIds.includes(member.auth0_id)
      );

      setFilteredMembers(availableMembers);
    } else {
      setFilteredMembers(members);
    }
  }, [members, contacts]);

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


  // Socket initialization and management
  useEffect(() => {
    if (!socketRef.current && isAuthenticated && user) {
      socketRef.current = io("http://localhost:3001", {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      socketRef.current.on('new_message', (message) => {
        console.log('New message received:', message);
        queryClient.invalidateQueries({ queryKey: ['messageConversations'] });
      });

      socketRef.current.on('new_conversation', (data) => {
        console.log('New conversation created:', data);
        queryClient.invalidateQueries({ queryKey: ['userConversations'] });
      });

      socketRef.current.on('conversation_updated', (data) => {
        console.log('Conversation updated:', data);
        queryClient.invalidateQueries({ queryKey: ['userConversations'] });
      });

      socketRef.current.on('member_interaction', (data) => {
        console.log('Member interaction:', data);
        // Handle different types of member interactions
        if (data.type === 'conversation_created_successfully' || data.type === 'new_conversation_available') {
          queryClient.invalidateQueries({ queryKey: ['userConversations'] });
          queryClient.invalidateQueries({ queryKey: ['allMembers'] });
        }
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, queryClient]);

  // Join conversation room when selectedContactId changes
  useEffect(() => {
    if (socketRef.current && selectedContactId) {
      socketRef.current.emit('join_conversation', selectedContactId);
    }
  }, [selectedContactId]);

  const onButtonClick = () => {
    setMessagesBoxSwitch(2);
  }

  const handleSelectConversation = (id) => {
    setMessagesBoxSwitch(1);
    setSelectedContactId(id);
  };

  const onSelectMember = async (id, name) => {
    const conversation_name = `${user.name} - ${name}`;
    const created_at = getCurrentUTCDateTime();
    const newConversation = await CreateConversation(user, getAccessTokenSilently, isAuthenticated, conversation_name, created_at, id);

    // Emit new conversation event via socket
    if (socketRef.current && newConversation) {
      socketRef.current.emit('new_conversation', {
        conversation: newConversation,
        participants: [user.sub, id]
      });
    }

    // Refresh both user conversations and all members to update the filtered list
    queryClient.invalidateQueries({ queryKey: ['userConversations'] });
    queryClient.invalidateQueries({ queryKey: ['allMembers'] });

    // Switch back to message view
    setMessagesBoxSwitch(1);
  }

  // Socket helper functions to pass to components
  const emitMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', data);
    }
  };

  const emitConversationUpdate = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('conversation_updated', data);
    }
  };

  const emitMemberInteraction = (data) => {
    if (socketRef.current) {
      socketRef.current.emit('member_interaction', data);
    }
  };

  if (isMessageConversationsPending || isUserConversationsPending || !contacts) {
    return <div>Loading...</div>;
  }

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
      />
      {messagesBoxSwitch === 2 ? (
        <AllMembers
          members={filteredMembers}
          onSelectMember={onSelectMember}
          onEmitMemberInteraction={emitMemberInteraction}
        />
      ) : (
        <MessageBox
          messages={allMessages}
          conversation_id={selectedContactId}
          onEmitMessage={emitMessage}
        />
      )}
    </div>
  );
}