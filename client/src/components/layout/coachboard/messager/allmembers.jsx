import React from "react";
import { useState } from "react";

export default function AllMembers({ members, onSelectMember, onEmitMemberInteraction }) {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);

    const handleSelectMember = (id, name) => {
        setSelectedMemberId(id);
        setSelectedName(name);
        
        // Emit member selection event via socket
        if (onEmitMemberInteraction) {
            onEmitMemberInteraction({
                type: 'member_selected',
                memberId: id,
                memberName: name,
                timestamp: new Date().toISOString()
            });
        }
    };

    const handleStartConversation = async () => {
        if (!selectedMemberId || !selectedName) {
            alert('Please select a member first');
            return;
        }

        setIsCreatingConversation(true);
        
        try {
            // Emit conversation creation intent
            if (onEmitMemberInteraction) {
                onEmitMemberInteraction({
                    type: 'conversation_creation_started',
                    memberId: selectedMemberId,
                    memberName: selectedName,
                    timestamp: new Date().toISOString()
                });
            }

            // Call the parent function to create conversation
            await onSelectMember(selectedMemberId, selectedName);
            
            // Emit successful conversation creation
            if (onEmitMemberInteraction) {
                onEmitMemberInteraction({
                    type: 'conversation_created_successfully',
                    memberId: selectedMemberId,
                    memberName: selectedName,
                    timestamp: new Date().toISOString()
                });
            }

            // Reset selection after successful creation
            setSelectedMemberId(null);
            setSelectedName(null);
            
        } catch (error) {
            console.error('Error creating conversation:', error);
            
            // Emit error event
            if (onEmitMemberInteraction) {
                onEmitMemberInteraction({
                    type: 'conversation_creation_failed',
                    memberId: selectedMemberId,
                    memberName: selectedName,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        } finally {
            setIsCreatingConversation(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-4 p-4 min-h-screen border-r border-gray-800">
            <div className="text-xl font-bold">All Members</div>
            
            {members.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <div className="text-lg mb-2">No available members</div>
                        <div className="text-sm">All members already have active conversations with you.</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {members.map((member) => (
                            <div
                                key={member.auth0_id}
                                className={`flex flex-col items-center bg-white rounded-lg p-4 shadow hover:bg-gray-100 cursor-pointer transition ${
                                    selectedMemberId === member.auth0_id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}
                                onClick={() => handleSelectMember(member.auth0_id, member.username)}
                            >
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                    className="w-14 h-14 rounded-full mb-2"
                                />
                                <div className="font-semibold text-black">{member.username}</div>
                                <div className="text-xs text-gray-400">{member.email}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button
                            className={`w-full py-2 rounded-lg transition ${
                                selectedMemberId && !isCreatingConversation
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={handleStartConversation}
                            disabled={!selectedMemberId || isCreatingConversation}
                        >
                            {isCreatingConversation 
                                ? 'Creating conversation...' 
                                : selectedName 
                                    ? `Bắt đầu trò chuyện với ${selectedName}`
                                    : 'Select a member to start conversation'
                            }
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}