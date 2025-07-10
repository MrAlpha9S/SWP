// PostPage.tsx
import SideBar from "./sideBar.jsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getComments, getPosts } from "../../utils/forumUtils.js";
import React, { useEffect, useState } from "react";
import { convertYYYYMMDDStrToDDMMYYYYStr } from "../../utils/dateUtils.js";
import { FaCommentAlt, FaRegHeart, FaFlag } from "react-icons/fa";
import { AddComment } from '../../utils/forumUtils.js'
import { useAuth0 } from "@auth0/auth0-react";

export default function PostPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { category, postId } = useParams();

    const { isPending: isPostPending, data: postData, error: postError } = useQuery({
        queryKey: ['get-single-post', postId],
        queryFn: () =>
            getPosts({
                postId: postId,
            }),
        enabled: !!postId, // Only run query if postId exists
    });

    const { isPending: isCommentsPending, data: commentsData, error: commentsError } = useQuery({
        queryKey: ['get-post-comments', postId],
        queryFn: () =>
            getComments({
                postId: postId,
            }),
        enabled: !!postId, // Only run query if postId exists
    });

    useEffect(() => {
        if (!isPostPending && postData?.data?.records?.[0]) {
            setPost(postData.data.records[0])
        }
    }, [postData, isPostPending])

    useEffect(() => {
        if (!isCommentsPending && commentsData?.data) {
            setComments(commentsData.data);
        }
    }, [commentsData, isCommentsPending])

    const addCommentMutation = useMutation({
        mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, postId, replyContent }) => {
            const currentDate = new Date().toISOString();
            return await AddComment(
                user,
                getAccessTokenSilently,
                isAuthenticated,
                null, // parent_comment_id
                postId,
                replyContent.trim(),
                currentDate,
                0 // is_reported
            );
        },
        onSuccess: (data) => {
            if (data.success || data.message === 'Comment added successfully') {
                setReplyContent('');
                queryClient.invalidateQueries(['get-post-comments', postId]);
                console.log('Success')
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Bình luận thành công',
                //     text: 'Bình luận của bạn đã được gửi!',
                // });
            }
        },
        onError: (error) => {
            console.error('Error adding comment:', error);
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Lỗi',
            //     text: 'Không thể gửi bình luận. Vui lòng thử lại!',
            // });
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });


    const onSubmit = () => {
        if (!replyContent || replyContent.trim() === '') return;

        if (!isAuthenticated || !user) {
            console.error('User not authenticated');
            // Swal.fire({
            //     icon: 'warning',
            //     title: 'Bạn chưa đăng nhập',
            //     text: 'Vui lòng đăng nhập để bình luận!',
            // });
            return;
        }

        setIsSubmitting(true);

        addCommentMutation.mutate({
            user,
            getAccessTokenSilently,
            isAuthenticated,
            postId,
            replyContent,
        });
    };

    // Loading state
    if (isPostPending) {
        return (
            <div className="flex min-h-screen mx-auto px-14 pt-14 pb-8 gap-8">
                <div className="space-y-6 w-[92%]">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="animate-pulse space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <SideBar isInPost={true} />
            </div>
        );
    }

    // Error state
    if (postError) {
        return (
            <div className="flex min-h-screen mx-auto px-14 pt-14 pb-8 gap-8">
                <div className="space-y-6 w-[92%]">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Post</h2>
                        <p className="text-red-600">Unable to load the post. Please try again later.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
                <SideBar isInPost={true} />
            </div>
        );
    }

    // No post found
    if (!post) {
        return (
            <div className="flex min-h-screen mx-auto px-14 pt-14 pb-8 gap-8">
                <div className="space-y-6 w-[92%]">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Post Not Found</h2>
                        <p className="text-yellow-600">The post you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate('/forum')}
                            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            Back to Forum
                        </button>
                    </div>
                </div>
                <SideBar isInPost={true} />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen mx-auto px-14 pt-14 pb-8 gap-8">
            <div className="space-y-6 w-[92%]">
                <div>
                    <h1 className="text-3xl font-bold text-primary-800 mb-2">{post.title}</h1>
                    <p className="text-sm text-gray-600">
                        Đăng tại <span className="text-primary-600 font-medium">{post.category_name}</span>
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {post.avatar ? (
                                <img className='w-full h-full object-cover rounded-full' src={post.avatar} alt={post.username} />
                            ) : (
                                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">{post.username?.[0]?.toUpperCase()}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <p>đăng bởi </p>
                            <a className="font-semibold hover:underline cursor-pointer" onClick={() => navigate(`/forum/profile/${post.auth0_id}`)}>{post.username}</a>
                        </div>
                    </div>

                    <div className="text-gray-800 space-y-3 text-[15px] leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500 pt-2 border-t">
                        <button className='flex items-center gap-2 hover:text-primary-600 transition-colors'>
                            <FaRegHeart className='size-4' /> {post.likes || 0} Likes
                        </button>
                        <button className='flex items-center gap-2 hover:text-primary-600 transition-colors'>
                            <FaCommentAlt /> {comments.length} Reply
                        </button>
                        <button className='flex items-center gap-2 hover:text-red-500 transition-colors'>
                            <FaFlag /> Report
                        </button>
                    </div>
                    <ReplyForm
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        isAuthenticated={isAuthenticated}
                    />
                </div>

                <div className="space-y-4 mt-6">
                    <h2 className="text-lg font-semibold">
                        {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                    </h2>

                    {isCommentsPending ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl shadow">
                                    <div className="animate-pulse space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : commentsError ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-600">Error loading comments. Please try again later.</p>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment) =>
                                <Comment
                                    key={comment.comment_id}
                                    date={comment.created_at}
                                    author={comment.username}
                                    content={comment.content}
                                    role={comment.role}
                                    avatar={comment.avatar}
                                    likes={comment.like_count}
                                    auth0_id={comment.auth0_id}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                            <p className="text-gray-600">Chưa có chưa trả lời nào. Hãy là người đầu tiên!</p>
                        </div>
                    )}
                </div>
            </div>

            <SideBar isInPost={true} />
        </div>
    );
}

export function Comment({ author, date, content, role, likes, avatar, auth0_id }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    {avatar ? (
                        <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs">{author?.[0]?.toUpperCase()}</span>
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-semibold flex items-center hover:underline cursor-pointer" onClick={() => navigate(`/forum/profile/${auth0_id}`)}>
                        {author}{" "}
                        {role && <span className="text-xs text-primary-600 font-medium ml-1">• {role}</span>}
                    </p>
                    <p className="text-sm text-gray-500">
                        {date && convertYYYYMMDDStrToDDMMYYYYStr(date.split('T')[0])}
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-800">{content}</p>
            <div className="flex gap-4 text-xs text-gray-500 pt-2">
                <button className='flex items-center gap-2 hover:text-primary-600 transition-colors'>
                    <FaRegHeart className='size-4' /> {likes || 0} Likes
                </button>
                <button className='flex items-center gap-2 hover:text-red-500 transition-colors'>
                    <FaFlag /> Report
                </button>
            </div>
        </div>
    );
}

export function ReplyForm({ replyContent, setReplyContent, onSubmit, isSubmitting, isAuthenticated }) {
    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">Bạn cần đăng nhập để trả lời bài viết này.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div>
            <textarea
                onChange={(e) => setReplyContent(e.target.value)}
                value={replyContent}
                placeholder="Viết câu trả lời tại đây..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                disabled={isSubmitting}
            />
            <div className="flex gap-3 mt-3">
                <button
                    onClick={onSubmit}
                    type="submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {isSubmitting ? 'Đang gửi...' : 'Trả lời'}
                </button>
            </div>
        </div>
    );
}