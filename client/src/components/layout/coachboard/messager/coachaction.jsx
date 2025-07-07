import { Search, Plus, FileText, MessageCircle, Circle, Users, X, Clock } from 'lucide-react';

export default function CoachAction({ role, handleNewConversationClick }) {
    if (role === 'Coach') {
        return (
            <div className="p-4 border-t border-gray-700 space-y-2">
                <button
                    onClick={handleNewConversationClick}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                >
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">New Conversation</div>
                        <div className="text-xs text-blue-100">Start a new conversation</div>
                    </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="font-semibold">Create Plan</div>
                        <div className="text-xs text-gray-300">Create a plan for users</div>
                    </div>
                </button>
            </div>
        )
    } else {
        return <></>
    }

}