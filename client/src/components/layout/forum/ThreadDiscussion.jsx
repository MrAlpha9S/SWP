
import { useState } from 'react';
import { ArrowLeft, Heart, MessageSquare, Flag, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ThreadDiscussion = () => {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [newComment, setNewComment] = useState('');

  // Mock thread data - in a real app, this would come from an API
  const thread = {
    id: parseInt(threadId),
    title: "Welcome to our community! Let's get started with introductions",
    content: "Hi everyone! I'm excited to be part of this community. I've been working with React for about 2 years now and I'm always looking to learn new things. What brings you here? Feel free to share a bit about yourself and what you're working on!",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face&auto=format"
    },
    timestamp: "2 tiếng trước",
    likes: 24,
    comments: 8,
    isLiked: false
  };

  const comments = [
    {
      id: 1,
      content: "Welcome to the community! I'm a frontend developer with 3 years of experience. Currently working on a React project with TypeScript.",
      author: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format"
      },
      timestamp: "1 tiếng trước",
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      content: "Great to meet everyone! I'm new to React but have been coding for a while. Looking forward to learning from you all.",
      author: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format"
      },
      timestamp: "45 phút trước",
      likes: 3,
      isLiked: true
    }
  ];

  const handleBack = () => {
    navigate('/forum');
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
          <div className="px-6 py-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Trở về Cộng đồng</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-800">Bài viết</h1>
          </div>
        </header>

        <div className="px-6 py-8">
          {/* Thread Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
            {/* Thread Header */}
            <div className="flex items-start space-x-4 mb-6">
              <img
                src={thread.author.avatar}
                alt={thread.author.name}
                className="w-12 h-12 rounded-full ring-2 ring-slate-100 object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {thread.author.name}
                    </h3>
                    <p className="text-slate-500 text-sm">{thread.timestamp}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thread Title & Content */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 leading-relaxed">
                {thread.title}
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {thread.content}
              </p>
            </div>

            {/* Thread Actions */}
            <div className="flex items-center space-x-6 pt-4 border-t border-slate-100">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
                <Heart className="h-5 w-5" />
                <span className="font-medium">{thread.likes}</span>
              </button>
              <div className="flex items-center space-x-2 text-slate-600">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">{comments.length} bình luận</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Bình luận</h3>
            
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">
                        {comment.author.name}
                      </h4>
                      <span className="text-slate-500 text-sm">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mb-3 leading-relaxed">
                      {comment.content}
                    </p>
                    <button className="flex items-center space-x-2 px-2 py-1 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
                      <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current text-red-600' : ''}`} />
                      <span className="text-sm font-medium">{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <div className="mt-8">
            <form onSubmit={handleSubmitComment} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4">
              <h4 className="font-semibold text-slate-800 mb-3">Thêm bình luận</h4>
              <div className="flex space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ..."
                    className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      <span>Đăng</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDiscussion;
