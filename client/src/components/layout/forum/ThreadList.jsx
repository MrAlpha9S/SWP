
import ThreadCard from './ThreadCard';

const ThreadList = ({ threads, onThreadClick, onLike, onReport }) => {
  return (
    <div className="px-6 py-8">
      <div className="space-y-4">
        {threads.map((thread, index) => (
          <div
            key={thread.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ThreadCard
              thread={thread}
              onThreadClick={onThreadClick}
              onLike={onLike}
              onReport={onReport}
            />
          </div>
        ))}
      </div>
      
      {threads.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 max-w-md mx-auto">
            <div className="text-slate-400 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No threads yet</h3>
            <p className="text-slate-500">Be the first to start a conversation!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadList;
