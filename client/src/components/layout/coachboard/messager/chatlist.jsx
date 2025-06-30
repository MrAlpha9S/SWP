import React from 'react';

export default function ChatList({ 
  user, 
  contacts, 
  selectedContactId, 
  onSelect, 
  onButtonClick, 
  role, 
  onEmitConversationUpdate 
}) {

  const handleSelectConversation = (conversationId) => {
    // Emit conversation update when selecting a conversation
    if (onEmitConversationUpdate) {
      onEmitConversationUpdate({
        type: 'conversation_selected',
        conversationId: conversationId,
        userId: user
      });
    }
    
    onSelect(conversationId);
  };

  const handleNewConversationClick = () => {
    // Emit event for new conversation intent
    if (onEmitConversationUpdate) {
      onEmitConversationUpdate({
        type: 'new_conversation_intent',
        userId: user
      });
    }
    
    onButtonClick();
  };

  return (
    <div className="w-1/4 border-r border-gray-800 p-4">
      <div className="text-xl font-bold mb-4">{user}</div>
      <div className="space-y-4 overflow-y-auto h-full">
        {contacts.map((c) => (
          <div
            key={c.conversation_id}
            onClick={() => handleSelectConversation(c.conversation_id)}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${c.conversation_id === selectedContactId ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
          >
            <div>
              <div className="font-semibold">{c.conversation_name}</div>
              <div className="text-xs text-gray-400">Active recently</div>
            </div>
          </div>
        ))}
        {role === 'Coach' && (
          <div
            onClick={handleNewConversationClick}
            className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-800`}
          >
            <div>
              <div className="font-semibold">New Conversation</div>
              <div className="text-xs text-gray-400">Start a new chat</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}