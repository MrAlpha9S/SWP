import React, { useState, useMemo, useCallback } from 'react';
import { Search, MessageCircle, Circle, Users, X, Clock } from 'lucide-react';
import CoachAction from './coachaction';

export default function ChatList({
  user,
  contacts,
  selectedContactId,
  onSelect,
  onButtonClick,
  role,
  onEmitConversationUpdate,
  getUserOnlineStatus,
  getUserLastSeen,
  formatLastSeen
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = contact.conversation_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOnlineFilter = !showOnlineOnly || 
        (contact.other_participant_id && getUserOnlineStatus && getUserOnlineStatus(contact.other_participant_id));
      
      return matchesSearch && matchesOnlineFilter;
    });

    // Sort by online status first, then by conversation name
    return filtered.sort((a, b) => {
      const aOnline = a.other_participant_id && getUserOnlineStatus ? getUserOnlineStatus(a.other_participant_id) : false;
      const bOnline = b.other_participant_id && getUserOnlineStatus ? getUserOnlineStatus(b.other_participant_id) : false;
      
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      
      return (a.conversation_name || '').localeCompare(b.conversation_name || '');
    });
  }, [contacts, searchTerm, showOnlineOnly, getUserOnlineStatus]);

  const handleSelectConversation = useCallback((conversationId) => {
    // Emit conversation update when selecting a conversation
    if (onEmitConversationUpdate) {
      onEmitConversationUpdate({
        type: 'conversation_selected',
        conversationId: conversationId,
        userId: user,
        timestamp: new Date().toISOString()
      });
    }

    onSelect(conversationId);
  }, [onEmitConversationUpdate, onSelect, user]);

  const handleNewConversationClick = useCallback(() => {
    // Emit event for new conversation intent
    if (onEmitConversationUpdate) {
      onEmitConversationUpdate({
        type: 'new_conversation_intent',
        userId: user,
        timestamp: new Date().toISOString()
      });
    }

    onButtonClick();
  }, [onEmitConversationUpdate, onButtonClick, user]);

  const renderOnlineStatus = (userId) => {
    const isOnline = getUserOnlineStatus ? getUserOnlineStatus(userId) : false;
    const lastSeen = getUserLastSeen ? getUserLastSeen(userId) : null;
    
    return (
      <div className="flex items-center gap-1 text-xs">
        <Circle 
          className={`w-2 h-2 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
        />
        <span className={isOnline ? 'text-green-400' : 'text-gray-500'}>
          {isOnline ? 'Online' : (lastSeen && formatLastSeen ? formatLastSeen(lastSeen) : 'Offline')}
        </span>
      </div>
    );
  };

  const getAvatarContent = (contact) => {
    if (contact.avatar) {
      return (
        <img
          src={contact.avatar}
          alt={contact.conversation_name}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => { 
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
        <span className="text-white text-sm font-semibold">
          {contact.conversation_name ? contact.conversation_name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>
    );
  };

  

  return (
    <div className="w-1/4 border-r border-gray-700 bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.avatar}/>
          <div>
            <div className="text-xl font-bold text-white">{user}</div>
            <div className="text-sm text-gray-400">
              {contacts.length} cuộc trò chuyện
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <div className="text-sm">
                  {searchTerm ? 'Không tìm thấy trò chuyện nào' : 'Chưa có cuộc trò chuyện nào'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {searchTerm ? 'Hãy thử thay đổi từ khoá tìm kiếm' : 'Tạo cuộc trò chuyện mới'}
                </div>
              </div>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isOnline = contact.other_participant_id && getUserOnlineStatus ? 
                getUserOnlineStatus(contact.other_participant_id) : false;
              const isSelected = contact.conversation_id === selectedContactId;

              return (
                <div
                  key={contact.conversation_id}
                  onClick={() => handleSelectConversation(contact.conversation_id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary-600 shadow-lg' 
                      : 'hover:bg-gray-700'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectConversation(contact.conversation_id);
                    }
                  }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 relative">
                      {getAvatarContent(contact)}
                    </div>
                    {/* Online status indicator */}
                    {contact.other_participant_id && isOnline && (
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center"
                        title="Online"
                      >
                        <Circle className="w-2 h-2 fill-white text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className={`font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-gray-100'
                      }`}>
                        {contact.conversation_name}         
                      </div>
                      {contact.unread_count > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                          {contact.unread_count > 99 ? '99+' : contact.unread_count}
                        </div>
                      )}
                    </div>
                    {contact.other_participant_id && renderOnlineStatus(contact.other_participant_id)}
                    {contact.last_message && (
                      <div className={`text-xs truncate mt-1 ${
                        isSelected ? 'text-primary-100' : 'text-gray-400'
                      }`}>
                        {contact.last_message}
                      </div>
                    )}
                    {contact.last_message_time && (
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        isSelected ? 'text-primary-200' : 'text-gray-500'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {formatLastSeen ? formatLastSeen(contact.last_message_time) : contact.last_message_time}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <CoachAction role={role} handleNewConversationClick={handleNewConversationClick} />
      
    </div>
  );
}