import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForumHeader from '../../components/layout/forum/ForumHeader.jsx';
import ThreadList from '../../components/layout/forum/ThreadList';

const ForumPage = () => {
    const navigate = useNavigate();

    const [threads, setThreads] = useState([
        {
            id: 1,
            title: "Welcome to our community! Let's get started with introductions",
            author: {
                name: "Sarah Johnson",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face&auto=format"
            },
            timestamp: "2 tiếng trước",
            likes: 24,
            comments: 8,
            isLiked: false
        },
        {
            id: 2,
            title: "Best practices for React development in 2024",
            author: {
                name: "Michael Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format"
            },
            timestamp: "4 tiếng trước",
            likes: 42,
            comments: 15,
            isLiked: true
        },
        {
            id: 3,
            title: "How to optimize your Tailwind CSS workflow",
            author: {
                name: "Emma Rodriguez",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format"
            },
            timestamp: "1 ngày trước",
            likes: 18,
            comments: 6,
            isLiked: false
        },
        {
            id: 4,
            title: "Discussion: The future of web development frameworks",
            author: {
                name: "David Kim",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
            },
            timestamp: "2 ngày trước",
            likes: 67,
            comments: 23,
            isLiked: true
        },
        {
            id: 5,
            title: "Help needed: Debugging async/await issues",
            author: {
                name: "Lisa Zhang",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format"
            },
            timestamp: "3 ngày trước",
            likes: 12,
            comments: 9,
            isLiked: false
        }
    ]);

    const handleCreateThread = () => {
        console.log('Create thread clicked');
        // In a real app, this would open a modal or navigate to create thread page
    };

    const handleThreadClick = (threadId) => {
        console.log('Thread clicked:', threadId);
        navigate(`/forum/thread/${threadId}`);
    };

    const handleLike = (threadId) => {
        setThreads(prevThreads =>
            prevThreads.map(thread =>
                thread.id === threadId
                    ? {
                        ...thread,
                        isLiked: !thread.isLiked,
                        likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1
                    }
                    : thread
            )
        );
    };

    const handleReport = (threadId) => {
        console.log('Report thread:', threadId);
        // In a real app, this would open a report modal
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-4xl mx-auto">
                <ForumHeader onCreateThread={handleCreateThread} />
                <ThreadList
                    threads={threads}
                    onThreadClick={handleThreadClick}
                    onLike={handleLike}
                    onReport={handleReport}
                />
            </div>
        </div>
    );
};

export default ForumPage;
