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
                        <div className="font-semibold">Trò chuyện mới</div>
                        <div className="text-xs text-blue-100">Bắt đầu một trò chuyện mới</div>
                    </div>
                </button>
            </div>
        )
    } else {
        return <></>
    }

}