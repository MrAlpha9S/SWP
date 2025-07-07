import React, { useState, useCallback, useMemo } from "react";
import { Search, User, Users, Clock, Circle, MessageCircle, X } from "lucide-react";

export default function AllMembers({
    members,
    onSelectMember,
    onEmitMemberInteraction,
    onlineUsers,
    getUserOnlineStatus,
    getUserLastSeen,
    formatLastSeen
}) {
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Filter members based on search term and online status
    const filteredMembers = useMemo(() => {
        let filtered = members.filter(member => {
            const matchesSearch = member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                member.name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesOnlineFilter = !showOnlineOnly || 
                                      (getUserOnlineStatus && getUserOnlineStatus(member.auth0_id));
            
            return matchesSearch && matchesOnlineFilter;
        });

        // Sort by online status first, then by name
        return filtered.sort((a, b) => {
            const aOnline = getUserOnlineStatus ? getUserOnlineStatus(a.auth0_id) : false;
            const bOnline = getUserOnlineStatus ? getUserOnlineStatus(b.auth0_id) : false;
            
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            
            return (a.username || a.name || '').localeCompare(b.username || b.name || '');
        });
    }, [members, searchTerm, showOnlineOnly, getUserOnlineStatus]);

    const handleSelectMember = useCallback((id, name) => {
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
    }, [onEmitMemberInteraction]);

    const handleStartConversation = useCallback(async () => {
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
    }, [selectedMemberId, selectedName, onSelectMember, onEmitMemberInteraction]);

    const clearSelection = useCallback(() => {
        setSelectedMemberId(null);
        setSelectedName(null);
    }, []);

    const renderOnlineStatus = (userId) => {
        const isOnline = getUserOnlineStatus ? getUserOnlineStatus(userId) : false;
        const lastSeen = getUserLastSeen ? getUserLastSeen(userId) : null;

        return (
            <div className="flex items-center gap-1 text-xs">
                <Circle 
                    className={`w-2 h-2 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
                />
                <span className={isOnline ? 'text-green-600' : 'text-gray-500'}>
                    {isOnline ? 'Online' : (lastSeen && formatLastSeen ? formatLastSeen(lastSeen) : 'Offline')}
                </span>
            </div>
        );
    };

    const renderMemberCard = (member) => {
        const isSelected = selectedMemberId === member.auth0_id;
        const isOnline = getUserOnlineStatus ? getUserOnlineStatus(member.auth0_id) : false;

        return (
            <div
                key={member.auth0_id}
                className={`relative flex flex-col items-center bg-white rounded-lg p-4 shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 ${
                    isSelected ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectMember(member.auth0_id, member.username || member.name)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${member.username || member.name} to start conversation`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectMember(member.auth0_id, member.username || member.name);
                    }
                }}
            >
                <div className="relative">
                    <img
                        src={member.avatar || '/default-avatar.png'}
                        alt={`${member.username || member.name}'s avatar`}
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-gray-200"
                    />
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="text-center w-full">
                    <div className="font-semibold text-gray-900 truncate mb-1">
                        {member.username || member.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate mb-2">
                        {member.email}
                    </div>
                    {renderOnlineStatus(member.auth0_id)}
                </div>
                {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>
        );
    };

    const renderMemberList = (member) => {
        const isSelected = selectedMemberId === member.auth0_id;
        const isOnline = getUserOnlineStatus ? getUserOnlineStatus(member.auth0_id) : false;

        return (
            <div
                key={member.auth0_id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected ? 'bg-primary-50 border-2 border-primary-500' : 'bg-white hover:bg-gray-50 border-2 border-gray-200'
                }`}
                onClick={() => handleSelectMember(member.auth0_id, member.username || member.name)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${member.username || member.name} to start conversation`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectMember(member.auth0_id, member.username || member.name);
                    }
                }}
            >
                <div className="relative">
                    <img
                        src={member.avatar || '/default-avatar.png'}
                        alt={`${member.username || member.name}'s avatar`}
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                    {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                        {member.username || member.name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {member.email}
                    </div>
                    {renderOnlineStatus(member.auth0_id)}
                </div>
                {isSelected && (
                    <MessageCircle className="w-5 h-5 text-primary-500" />
                )}
            </div>
        );
    };

    const onlineCount = useMemo(() => {
        return members.filter(member => 
            getUserOnlineStatus ? getUserOnlineStatus(member.auth0_id) : false
        ).length;
    }, [members, getUserOnlineStatus]);

    return (
        <div className="flex-1 flex flex-col gap-4 p-6 min-h-screen border-r border-gray-200 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-gray-700" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Members</h1>
                        <p className="text-sm text-gray-600">
                            {members.length} members • {onlineCount} online
                        </p>
                    </div>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Grid view"
                    >
                        <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                            <div className="bg-current rounded-sm"></div>
                            <div className="bg-current rounded-sm"></div>
                            <div className="bg-current rounded-sm"></div>
                            <div className="bg-current rounded-sm"></div>
                        </div>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="List view"
                    >
                        <div className="w-4 h-4 flex flex-col gap-0.5">
                            <div className="bg-current h-0.5 rounded-sm"></div>
                            <div className="bg-current h-0.5 rounded-sm"></div>
                            <div className="bg-current h-0.5 rounded-sm"></div>
                            <div className="bg-current h-0.5 rounded-sm"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <button
                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        showOnlineOnly 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <Circle className={`w-4 h-4 ${showOnlineOnly ? 'fill-white' : 'fill-green-500 text-green-500'}`} />
                    Online Only
                </button>
            </div>

            {/* Selected Member Banner */}
            {selectedMemberId && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary-600" />
                        <span className="text-primary-900 font-medium">Selected: {selectedName}</span>
                    </div>
                    <button
                        onClick={clearSelection}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                        aria-label="Clear selection"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Members List */}
            <div className="flex-1 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <div className="text-lg mb-2 font-medium">
                                {searchTerm ? 'No members found' : 'No available members'}
                            </div>
                            <div className="text-sm">
                                {searchTerm 
                                    ? 'Try adjusting your search terms or filters.'
                                    : 'All members already have active conversations with you.'
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
                        : 'space-y-2'
                    }>
                        {filteredMembers.map(member => 
                            viewMode === 'grid' ? renderMemberCard(member) : renderMemberList(member)
                        )}
                    </div>
                )}
            </div>

            {/* Action Button */}
            {filteredMembers.length > 0 && (
                <div className="bg-white border-t border-gray-200 p-4 -m-6 mt-0">
                    <button
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                            selectedMemberId && !isCreatingConversation
                                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handleStartConversation}
                        disabled={!selectedMemberId || isCreatingConversation}
                    >
                        {isCreatingConversation ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating conversation...
                            </div>
                        ) : selectedName ? (
                            `Start conversation with ${selectedName}`
                        ) : (
                            'Select a member to start conversation'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}