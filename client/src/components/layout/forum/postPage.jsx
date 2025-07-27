// PostPage.tsx - Updated with Report Modal Integration and AddReport
import SideBar from "./sideBar.jsx";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getComments, getPosts } from "../../utils/forumUtils.js";
import React, { useEffect, useState, useRef } from "react";
import { convertYYYYMMDDStrToDDMMYYYYStr } from "../../utils/dateUtils.js";
import { FaCommentAlt, FaRegHeart, FaHeart, FaFlag } from "react-icons/fa";
import { AddComment, AddLike } from '../../utils/forumUtils.js'; // Added AddReport import
import { AddReport } from '../../utils/reportUtils.js'
import { ReportModal } from './postpagecomponents/reportModal.jsx';
//import {Comment} from './postpagecomponents/comment.jsx'
import { ReplyForm } from './postpagecomponents/replyform.jsx'

import { useAuth0 } from "@auth0/auth0-react";
import PageFadeWrapper from "../../utils/PageFadeWrapper.jsx";
import {useHighlightCommentIdStore, useUserInfoStore} from "../../../stores/store.js";

export default function PostPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReportSubmitting, setIsReportSubmitting] = useState(false); // Added for report submission state
    const {userInfo} = useUserInfoStore()
    const {highlightCommentId, setHighlightCommentId} = useHighlightCommentIdStore()

    // Refs for scroll behavior
    const commentRefs = useRef({});

    // Report Modal State
    const [reportModal, setReportModal] = useState({
        isOpen: false,
        type: null, // 'post' or 'comment'
        itemId: null,
        itemAuthor: null
    });

    const { category, postId } = useParams();

    const { isPending: isPostPending, data: postData, error: postError } = useQuery({
        queryKey: ['get-single-post', postId],
        queryFn: () =>
            getPosts({
                postId: postId,
                currentUserId: user?.sub,
            }),
        enabled: !!postId, // Only run query if postId exists
    });

    const { isPending: isCommentsPending, data: commentsData, error: commentsError } = useQuery({
        queryKey: ['get-post-comments', postId],
        queryFn: () =>
            getComments({
                postId: postId,
                currentUserId: user?.sub
            }),
        enabled: !!postId, // Only run query if postId exists
    });

    useEffect(() => {
        if (!isPostPending && postData?.data?.records?.[0]) {
            setPost(postData.data.records[0])
        }
    }, [postData, isPostPending, post])

    useEffect(() => {
        if (!isCommentsPending && commentsData?.data) {
            setComments(commentsData.data);
        }
    }, [commentsData, isCommentsPending])

    // Scroll to highlighted comment
    useEffect(() => {
        if (highlightCommentId && highlightCommentId !== 0 && comments.length > 0) {
            const commentElement = commentRefs.current[highlightCommentId];
            if (commentElement) {
                // Add a small delay to ensure the DOM is fully rendered
                setTimeout(() => {
                    commentElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
    }, [highlightCommentId, comments]);

    // Reset highlight when leaving the page
    useEffect(() => {
        return () => setHighlightCommentId(0);
    }, []);

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
            }
        },
        onError: (error) => {
            console.error('Error adding comment:', error);
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });

    const addLikeMutation = useMutation({
        mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, postId, commentId, username }) => {
            console.log('addLikeMutation: ', user.sub, postId, commentId)
            const currentDate = new Date().toISOString();
            return await AddLike(
                user,
                getAccessTokenSilently,
                isAuthenticated,
                postId,
                commentId,
                currentDate,
                username
            );
        },
        onSuccess: (data) => {
            if (data.success || data.message === 'Like added successfully') {
                setReplyContent('');
                queryClient.invalidateQueries(['get-single-post', postId]);
                queryClient.invalidateQueries(['get-post-comments', postId]);
                console.log('Success')
            }
        },
        onError: (error) => {
            console.error('Error adding like:', error);
        },
    });

    // Added Report Mutation
    const addReportMutation = useMutation({
        mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, postId, commentId, reason, description }) => {
            const currentDate = new Date().toISOString();
            return await AddReport(
                user,
                getAccessTokenSilently,
                isAuthenticated,
                postId,
                commentId,
                reason,
                description,
                currentDate
            );
        },
        onSuccess: (data) => {
            if (data.success || data.message === 'Report added successfully') {
                setReportModal({ isOpen: false, type: null, itemId: null, itemAuthor: null });
                console.log('Report submitted successfully');
                // Show success message
                alert('Báo cáo đã được gửi thành công!');
            }
        },
        onError: (error) => {
            console.error('Error submitting report:', error);
            alert('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!');
        },
        onSettled: () => {
            setIsReportSubmitting(false);
        },
    });

    // Report Modal Functions
    const handleReportClick = (type, itemId, itemAuthor) => {
        setReportModal({
            isOpen: true,
            type: type,
            itemId: itemId,
            itemAuthor: itemAuthor
        });
    };

    const handleReportSubmit = (reportData) => {
        if (!isAuthenticated || !user) {
            console.error('User not authenticated');
            return;
        }

        setIsReportSubmitting(true);

        // Prepare the parameters based on report type
        const reportParams = {
            user,
            getAccessTokenSilently,
            isAuthenticated,
            postId: reportModal.type === 'post' ? reportModal.itemId : null,
            commentId: reportModal.type === 'comment' ? reportModal.itemId : null,
            reason: reportData.reason,
            description: reportData.description
        };

        console.log('Submitting report:', {
            type: reportModal.type,
            itemId: reportModal.itemId,
            itemAuthor: reportModal.itemAuthor,
            reason: reportData.reason,
            description: reportData.description
        });

        addReportMutation.mutate(reportParams);
    };

    const handleReportClose = () => {
        setReportModal({ isOpen: false, type: null, itemId: null, itemAuthor: null });
    };

    const onSubmit = () => {
        if (!replyContent || replyContent.trim() === '') return;

        if (!isAuthenticated || !user) {
            console.error('User not authenticated');
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

    const onLike = (postId = null, commentId = null) => {

        if (!isAuthenticated || !user) {
            console.error('User not authenticated');
            return;
        }

        const username = userInfo?.username;

        addLikeMutation.mutate({
            user,
            getAccessTokenSilently,
            isAuthenticated,
            postId,
            commentId,
            username
        });
    };

    // Function to handle comment hover (removes highlight)
    const handleCommentHover = (commentId) => {
        if (highlightCommentId === commentId) {
            setHighlightCommentId(0);
        }
    };

    // Loading state
    if (isPostPending) {
        return (
            <PageFadeWrapper>
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
            </PageFadeWrapper>

        );
    }

    // Error state
    if (postError) {
        return (
            <PageFadeWrapper>
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
            </PageFadeWrapper>

        );
    }

    // No post found
    if (!post || !user) {
        return (
            <PageFadeWrapper>
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
            </PageFadeWrapper>

        );
    }

    return (
        <PageFadeWrapper>
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
                            {user?.sub === post.auth0_id && (
                                <div
                                    className="text-primary-600 ml-auto hover:underline cursor-pointer"
                                    onClick={() => navigate(`/forum/edit/${post.post_id}`)}
                                >Sửa</div>
                            )}
                        </div>

                        <div className="text-gray-800 space-y-3 text-[15px] leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        <div className="flex gap-6 text-sm text-gray-500 pt-2 border-t">
                            <button
                                className='flex items-center gap-2 hover:text-primary-600 transition-colors'
                                onClick={() => onLike(post.post_id, null)}
                                disabled={post.isLiked === 1 || !user}
                            >
                                {post.isLiked === 1 ? (
                                    <FaHeart className='size-4 text-primary-600' />
                                ) : (
                                    <FaRegHeart className='size-4' />
                                )}
                                {post.likes || 0} Likes
                            </button>
                            <button className='flex items-center gap-2 hover:text-primary-600 transition-colors'>
                                <FaCommentAlt /> {comments.length} Reply
                            </button>
                            <button
                                className='flex items-center gap-2 hover:text-red-500 transition-colors'
                                onClick={() => handleReportClick('post', post.post_id, post.username)}
                                disabled={!user}
                            >
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
                                        ref={(el) => commentRefs.current[comment.comment_id] = el}
                                        commentId={comment.comment_id}
                                        date={comment.created_at}
                                        author={comment.username}
                                        content={comment.content}
                                        role={comment.role}
                                        avatar={comment.avatar}
                                        likes={comment.like_count}
                                        auth0_id={comment.auth0_id}
                                        isLiked={comment.isLiked}
                                        onLike={onLike}
                                        onReportClick={handleReportClick}
                                        isHighlighted={highlightCommentId === comment.comment_id}
                                        onHover={handleCommentHover}
                                        currentUserId={user?.sub}
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

                {/* Report Modal */}
                <ReportModal
                    isOpen={reportModal.isOpen}
                    onClose={handleReportClose}
                    onSubmit={handleReportSubmit}
                    isSubmitting={isReportSubmitting}
                    reportType={reportModal.type}
                    itemAuthor={reportModal.itemAuthor}
                />
            </div>
        </PageFadeWrapper>
    );
}

export const Comment = React.forwardRef(({
                                             author,
                                             commentId,
                                             date,
                                             content,
                                             role,
                                             likes,
                                             avatar,
                                             auth0_id,
                                             isLiked,
                                             onLike,
                                             onReportClick,
                                             isHighlighted,
                                             onHover,
                                             currentUserId
                                         }, ref) => {
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (isHighlighted && onHover) {
            onHover(commentId);
        }
    };

    return (
        <div
            ref={ref}
            className={`bg-white p-4 rounded-xl shadow space-y-2 hover:shadow-md transition-all duration-300 ${
                isHighlighted
                    ? 'ring-2 ring-primary-400 bg-primary-50 shadow-lg'
                    : ''
            }`}
            onMouseEnter={handleMouseEnter}
        >
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
                <button
                    className='flex items-center gap-2 hover:text-primary-600 transition-colors'
                    onClick={() => onLike(null, commentId)}
                    disabled={isLiked === 1 || !currentUserId}
                >
                    {isLiked === 1 ? (
                        <FaHeart className='size-4 text-primary-600' />
                    ) : (
                        <FaRegHeart className='size-4' />
                    )}
                    {likes || 0} Likes
                </button>
                <button
                    className='flex items-center gap-2 hover:text-red-500 transition-colors'
                    onClick={() => onReportClick('comment', commentId, author)}
                    disabled={!currentUserId}
                >
                    <FaFlag /> Report
                </button>
            </div>
        </div>
    );
});