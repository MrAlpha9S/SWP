
import { Heart, MessageSquare, Flag } from 'lucide-react';

const ThreadCard = ({ thread, onThreadClick, onLike, onReport }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200/60 hover:border-slate-300/60 transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Thread Header */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={thread.author.avatar}
            alt={thread.author.name}
            className="w-12 h-12 rounded-full ring-2 ring-slate-100 object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">
                  {thread.author.name}
                </h3>
                <p className="text-slate-500 text-sm">{thread.timestamp}</p>
              </div>
              <button
                onClick={() => onReport(thread.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Report thread"
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thread Title */}
        <div className="mb-4">
          <button
            onClick={() => onThreadClick(thread.id)}
            className="block w-full text-left group-thread"
          >
            <h2 className="text-xl font-semibold text-slate-800 leading-relaxed hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {thread.title}
            </h2>
          </button>
        </div>

        {/* Thread Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(thread.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                thread.isLiked
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart 
                className={`h-5 w-5 transition-all duration-200 ${
                  thread.isLiked ? 'fill-current' : ''
                }`} 
              />
              <span className="font-medium">{thread.likes}</span>
            </button>
            
            <button
              onClick={() => onThreadClick(thread.id)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">{thread.comments}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
