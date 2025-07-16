import React, { useEffect, useState } from 'react';
import { Rate, Input, Button, message, Space, Typography, Card } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';
import {
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
} from '../../utils/reviewUtils.js';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const ReviewForm = ({ coachAuth0Id, username }) => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();
    const userAuth0Id = user?.sub;

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviewId, setReviewId] = useState(null);

    const { data: reviewResponse = {}, isLoading, isFetching } = useQuery({
        queryKey: ['review', userAuth0Id, coachAuth0Id],
        queryFn: async () => {
            console.log('Query function called with:', { userAuth0Id, coachAuth0Id });
            const result = await getAllReviews(user, getAccessTokenSilently, isAuthenticated, userAuth0Id, coachAuth0Id);
            console.log('Query result:', result);
            console.log('Query result type:', typeof result);
            console.log('Query result is array:', Array.isArray(result));
            return result;
        },
        enabled: !!user && !!coachAuth0Id && isAuthenticated,
    });

    // Extract the actual data array from the response
    const reviewData = reviewResponse?.data || [];
    const existingReview = reviewData.length > 0 ? reviewData[0] : null;

    // Debug logging
    console.log('Component render:', {
        reviewData,
        existingReview,
        isEditing,
        isLoading,
        isFetching,
        reviewDataLength: reviewData.length,
        userAuth0Id,
        coachAuth0Id
    });

    // Fix: Update the useEffect to properly sync state with existing review
    useEffect(() => {
        if (existingReview && !isEditing) {
            setRating(existingReview.stars);
            setContent(existingReview.review_content);
            setReviewId(existingReview.review_id);
        } else if (!existingReview && !isEditing) {
            // Reset form when no existing review
            setRating(0);
            setContent('');
            setReviewId(null);
        }
    }, [existingReview, isEditing]); // Fix: Include existingReview in dependencies

    const createMutation = useMutation({
        mutationFn: ({ rating, content }) =>
            createReview(user, getAccessTokenSilently, isAuthenticated, userAuth0Id, coachAuth0Id, rating, content, username),
        onSuccess: (data) => {
            message.success('Đánh giá đã được gửi!');

            // Create optimistic review data
            const optimisticReview = {
                review_id: data.id || Date.now(), // Use returned ID or timestamp
                stars: rating,
                review_content: content,
                user_auth0_id: userAuth0Id,
                coach_auth0_id: coachAuth0Id
            };

            // Optimistically update the cache with the correct structure
            queryClient.setQueryData(['review', userAuth0Id, coachAuth0Id], {
                success: true,
                data: [optimisticReview]
            });

            setIsEditing(false);

            // Also try to refetch as backup
            queryClient.refetchQueries(['review', userAuth0Id, coachAuth0Id]);
        },
        onError: (error) => {
            console.log('Create mutation error:', error);
            message.error('Gửi đánh giá thất bại.');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ reviewId, rating, content }) =>
            updateReview(user, getAccessTokenSilently, isAuthenticated, reviewId, rating, content),
        onSuccess: (data) => {
            console.log('Update mutation success:', data);
            message.success('Đánh giá đã được cập nhật!');

            // Create optimistic review data
            const optimisticReview = {
                review_id: reviewId,
                stars: rating,
                review_content: content,
                user_auth0_id: userAuth0Id,
                coach_auth0_id: coachAuth0Id
            };

            // Optimistically update the cache with the correct structure
            queryClient.setQueryData(['review', userAuth0Id, coachAuth0Id], {
                success: true,
                data: [optimisticReview]
            });

            setIsEditing(false);

            // Also try to refetch as backup
            queryClient.refetchQueries(['review', userAuth0Id, coachAuth0Id]);
        },
        onError: (error) => {
            console.log('Update mutation error:', error);
            message.error('Cập nhật đánh giá thất bại.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (reviewId) =>
            deleteReview(user, getAccessTokenSilently, isAuthenticated, reviewId),
        onSuccess: () => {
            message.success('Đánh giá đã được xóa.');
            setRating(0);
            setContent('');
            setIsEditing(false);
            setReviewId(null);
            queryClient.invalidateQueries(['review', userAuth0Id, coachAuth0Id]);
        },
        onError: () => {
            message.error('Xóa đánh giá thất bại.');
        }
    });

    const handleSubmit = () => {
        if (!rating || !content.trim()) {
            return message.warning('Vui lòng nhập nội dung và đánh giá sao.');
        }

        if (reviewId) {
            updateMutation.mutate({ reviewId, rating, content: content.trim() });
        } else {
            createMutation.mutate({ rating, content: content.trim() });
        }
    };

    const handleDelete = () => {
        if (reviewId) {
            deleteMutation.mutate(reviewId);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (existingReview) {
            // Reset to existing review values
            setRating(existingReview.stars);
            setContent(existingReview.review_content);
            setReviewId(existingReview.review_id);
        }
        setIsEditing(false);
    };

    // Fix: Better condition for showing form vs card
    const showForm = !existingReview || isEditing;

    return (
        <div style={{ width: '100%' }}>
            {showForm ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Title level={5}>{isEditing ? 'Chỉnh sửa đánh giá của bạn' : 'Gửi đánh giá cho huấn luyện viên'}</Title>
                    <Rate value={rating} onChange={setRating} />
                    <TextArea
                        rows={4}
                        placeholder="Viết đánh giá của bạn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                        </Button>
                        {isEditing && (
                            <>
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button danger onClick={handleDelete} loading={deleteMutation.isPending}>
                                    Xóa đánh giá
                                </Button>
                            </>
                        )}
                    </Space>
                </Space>
            ) : (
                <Card title="Đánh giá của bạn" bordered>
                    <Space direction="vertical">
                        <Rate disabled value={existingReview.stars} />
                        <Paragraph>{existingReview.review_content}</Paragraph>
                        <Button type="link" onClick={handleEdit}>Chỉnh sửa</Button>
                        <Button danger type="link" onClick={handleDelete}>Xóa</Button>
                    </Space>
                </Card>
            )}
        </div>
    );
};

export default ReviewForm;