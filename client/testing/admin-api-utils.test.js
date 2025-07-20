import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleBanUser,
    createUser,
    getAllCoaches,
    getCoachById,
    updateCoach,
    deleteCoach,
    getAllPosts,
    getPostById,
    deletePost,
    createPost,
    updatePost,
    getPostLikes,
    getAllComments,
    deleteComment,
    getAllBlogs,
    getBlogById,
    deleteBlog,
    getAllTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    getAllSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getAllCheckIns,
    getCheckInById,
    deleteCheckIn,
    getStatistics,
    getAllUserSubscriptions,
    createUserSubscription,
    updateUserSubscription,
    deleteUserSubscription
} from '../src/components/utils/adminUtils.js';


globalThis.fetch = vi.fn();

describe('Admin API Utils', () => {
    const mockToken = 'test-token';
    const mockResponse = { success: true, data: 'test' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockFetchSuccess = (data = mockResponse) => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValueOnce(data)
        });
    };

    const mockFetchError = () => {
        globalThis.fetch.mockResolvedValueOnce({
            ok: false,
            json: vi.fn()
        });
    };

    describe('User Management', () => {
        describe('getAllUsers', () => {
            it('should fetch all users successfully', async () => {
                mockFetchSuccess();

                const result = await getAllUsers(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/users', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllUsers(mockToken)).rejects.toThrow('Lỗi lấy danh sách user');
            });
        });

        describe('getUserById', () => {
            it('should fetch user by id successfully', async () => {
                const userId = '123';
                mockFetchSuccess();

                const result = await getUserById(userId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/users/${userId}`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getUserById('123', mockToken)).rejects.toThrow('Lỗi lấy user');
            });
        });

        describe('updateUser', () => {
            it('should update user successfully', async () => {
                const userId = '123';
                const userData = { name: 'Updated User' };
                mockFetchSuccess();

                const result = await updateUser(userId, userData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updateUser('123', {}, mockToken)).rejects.toThrow('Lỗi cập nhật user');
            });
        });

        describe('deleteUser', () => {
            it('should delete user successfully', async () => {
                const userId = '123';
                mockFetchSuccess();

                const result = await deleteUser(userId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteUser('123', mockToken)).rejects.toThrow('Lỗi xóa user');
            });
        });

        describe('toggleBanUser', () => {
            it('should toggle user ban status successfully', async () => {
                const userId = '123';
                const isBanned = true;
                mockFetchSuccess();

                const result = await toggleBanUser(userId, isBanned, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/users/${userId}/ban`, {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ isBanned })
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(toggleBanUser('123', true, mockToken)).rejects.toThrow('Lỗi ban user');
            });
        });

        describe('createUser', () => {
            it('should create user successfully', async () => {
                const userData = { name: 'New User', email: 'test@test.com' };
                mockFetchSuccess();

                const result = await createUser(userData, mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/users', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(createUser({}, mockToken)).rejects.toThrow('Lỗi tạo user');
            });
        });
    });

    describe('Coach Management', () => {
        describe('getAllCoaches', () => {
            it('should fetch all coaches successfully', async () => {
                mockFetchSuccess();

                const result = await getAllCoaches(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/coaches', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllCoaches(mockToken)).rejects.toThrow('Lỗi lấy danh sách coach');
            });
        });

        describe('getCoachById', () => {
            it('should fetch coach by id successfully', async () => {
                const coachId = '123';
                mockFetchSuccess();

                const result = await getCoachById(coachId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/coaches/${coachId}`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getCoachById('123', mockToken)).rejects.toThrow('Lỗi lấy coach');
            });
        });

        describe('updateCoach', () => {
            it('should update coach successfully', async () => {
                const coachId = '123';
                const coachData = { name: 'Updated Coach' };
                mockFetchSuccess();

                const result = await updateCoach(coachId, coachData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/coaches/${coachId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(coachData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updateCoach('123', {}, mockToken)).rejects.toThrow('Lỗi cập nhật coach');
            });
        });

        describe('deleteCoach', () => {
            it('should delete coach successfully', async () => {
                const coachId = '123';
                mockFetchSuccess();

                const result = await deleteCoach(coachId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/coaches/${coachId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteCoach('123', mockToken)).rejects.toThrow('Lỗi xóa coach');
            });
        });
    });

    describe('Post Management', () => {
        describe('getAllPosts', () => {
            it('should fetch all posts successfully', async () => {
                mockFetchSuccess();

                const result = await getAllPosts(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/posts', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllPosts(mockToken)).rejects.toThrow('Lỗi lấy danh sách post');
            });
        });

        describe('getPostById', () => {
            it('should fetch post by id successfully', async () => {
                const postId = '123';
                mockFetchSuccess();

                const result = await getPostById(postId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getPostById('123', mockToken)).rejects.toThrow('Lỗi lấy post');
            });
        });

        describe('createPost', () => {
            it('should create post successfully', async () => {
                const postData = { title: 'New Post', content: 'Post content' };
                mockFetchSuccess();

                const result = await createPost(postData, mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/posts', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(createPost({}, mockToken)).rejects.toThrow('Lỗi tạo post');
            });
        });

        describe('updatePost', () => {
            it('should update post successfully', async () => {
                const postId = '123';
                const postData = { title: 'Updated Post' };
                mockFetchSuccess();

                const result = await updatePost(postId, postData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updatePost('123', {}, mockToken)).rejects.toThrow('Lỗi cập nhật post');
            });
        });

        describe('deletePost', () => {
            it('should delete post successfully', async () => {
                const postId = '123';
                mockFetchSuccess();

                const result = await deletePost(postId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/posts/${postId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deletePost('123', mockToken)).rejects.toThrow('Lỗi xóa post');
            });
        });

        describe('getPostLikes', () => {
            it('should fetch post likes successfully', async () => {
                const postId = '123';
                mockFetchSuccess();

                const result = await getPostLikes(postId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/posts/${postId}/likes`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getPostLikes('123', mockToken)).rejects.toThrow('Lỗi lấy danh sách like');
            });
        });
    });

    describe('Comment Management', () => {
        describe('getAllComments', () => {
            it('should fetch all comments successfully', async () => {
                mockFetchSuccess();

                const result = await getAllComments(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/comments', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllComments(mockToken)).rejects.toThrow('Lỗi lấy danh sách comment');
            });
        });

        describe('deleteComment', () => {
            it('should delete comment successfully', async () => {
                const commentId = '123';
                mockFetchSuccess();

                const result = await deleteComment(commentId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteComment('123', mockToken)).rejects.toThrow('Lỗi xóa comment');
            });
        });
    });

    describe('Blog Management', () => {
        describe('getAllBlogs', () => {
            it('should fetch all blogs successfully', async () => {
                mockFetchSuccess();

                const result = await getAllBlogs(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/blogs', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllBlogs(mockToken)).rejects.toThrow('Lỗi lấy danh sách blog');
            });
        });

        describe('getBlogById', () => {
            it('should fetch blog by id successfully', async () => {
                const blogId = '123';
                mockFetchSuccess();

                const result = await getBlogById(blogId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getBlogById('123', mockToken)).rejects.toThrow('Lỗi lấy blog');
            });
        });

        describe('deleteBlog', () => {
            it('should delete blog successfully', async () => {
                const blogId = '123';
                mockFetchSuccess();

                const result = await deleteBlog(blogId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/blogs/${blogId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteBlog('123', mockToken)).rejects.toThrow('Lỗi xóa blog');
            });
        });
    });

    describe('Topic Management', () => {
        describe('getAllTopics', () => {
            it('should fetch all topics successfully', async () => {
                mockFetchSuccess();

                const result = await getAllTopics(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/topics', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllTopics(mockToken)).rejects.toThrow('Lỗi lấy danh sách topic');
            });
        });

        describe('createTopic', () => {
            it('should create topic successfully', async () => {
                const topicData = {
                    topic_id: '123',
                    topic_name: 'New Topic',
                    topic_content: 'Topic content'
                };
                mockFetchSuccess();

                const result = await createTopic(topicData, mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/topics', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        topic_id: topicData.topic_id,
                        topic_name: topicData.topic_name,
                        topic_content: topicData.topic_content
                    })
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(createTopic({}, mockToken)).rejects.toThrow('Lỗi tạo topic');
            });
        });

        describe('updateTopic', () => {
            it('should update topic successfully', async () => {
                const topicId = '123';
                const topicData = { topic_name: 'Updated Topic' };
                mockFetchSuccess();

                const result = await updateTopic(topicId, topicData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/topics/${topicId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(topicData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updateTopic('123', {}, mockToken)).rejects.toThrow('Lỗi cập nhật topic');
            });
        });

        describe('deleteTopic', () => {
            it('should delete topic successfully', async () => {
                const topicId = '123';
                mockFetchSuccess();

                const result = await deleteTopic(topicId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/topics/${topicId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteTopic('123', mockToken)).rejects.toThrow('Lỗi xóa topic');
            });
        });
    });

    describe('Subscription Management', () => {
        describe('getAllSubscriptions', () => {
            it('should fetch all subscriptions successfully', async () => {
                mockFetchSuccess();

                const result = await getAllSubscriptions(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/subscriptions', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllSubscriptions(mockToken)).rejects.toThrow('Lỗi lấy danh sách subscription');
            });
        });

        describe('createSubscription', () => {
            it('should create subscription successfully', async () => {
                const subscriptionData = { name: 'New Subscription', price: 99 };
                mockFetchSuccess();

                const result = await createSubscription(subscriptionData, mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/subscriptions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscriptionData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(createSubscription({}, mockToken)).rejects.toThrow('Lỗi tạo subscription');
            });
        });

        describe('updateSubscription', () => {
            it('should update subscription successfully', async () => {
                const subscriptionId = '123';
                const subscriptionData = { name: 'Updated Subscription' };
                mockFetchSuccess();

                const result = await updateSubscription(subscriptionId, subscriptionData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/subscriptions/${subscriptionId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(subscriptionData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updateSubscription('123', {}, mockToken)).rejects.toThrow('Lỗi cập nhật subscription');
            });
        });

        describe('deleteSubscription', () => {
            it('should delete subscription successfully', async () => {
                const subscriptionId = '123';
                mockFetchSuccess();

                const result = await deleteSubscription(subscriptionId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/subscriptions/${subscriptionId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteSubscription('123', mockToken)).rejects.toThrow('Lỗi xóa subscription');
            });
        });
    });

    describe('User Subscription Management', () => {
        describe('getAllUserSubscriptions', () => {
            it('should fetch all user subscriptions successfully', async () => {
                mockFetchSuccess();

                const result = await getAllUserSubscriptions(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/user-subscriptions', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllUserSubscriptions(mockToken)).rejects.toThrow('Lỗi lấy danh sách user subscriptions');
            });
        });

        describe('createUserSubscription', () => {
            it('should create user subscription successfully', async () => {
                const userSubscriptionData = { user_id: '123', sub_id: '456' };
                mockFetchSuccess();

                const result = await createUserSubscription(userSubscriptionData, mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/user-subscriptions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userSubscriptionData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(createUserSubscription({}, mockToken)).rejects.toThrow('Lỗi tạo user subscription');
            });
        });

        describe('updateUserSubscription', () => {
            it('should update user subscription successfully', async () => {
                const userId = '123';
                const subId = '456';
                const updateData = { status: 'active' };
                mockFetchSuccess();

                const result = await updateUserSubscription(userId, subId, updateData, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/user-subscriptions/${userId}/${subId}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${mockToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(updateUserSubscription('123', '456', {}, mockToken)).rejects.toThrow('Lỗi cập nhật user subscription');
            });
        });

        describe('deleteUserSubscription', () => {
            it('should delete user subscription successfully', async () => {
                const userId = '123';
                const subId = '456';
                mockFetchSuccess();

                const result = await deleteUserSubscription(userId, subId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/user-subscriptions/${userId}/${subId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteUserSubscription('123', '456', mockToken)).rejects.toThrow('Lỗi xóa user subscription');
            });
        });
    });

    describe('Check-in Management', () => {
        describe('getAllCheckIns', () => {
            it('should fetch all check-ins successfully', async () => {
                mockFetchSuccess();

                const result = await getAllCheckIns(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/checkins', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getAllCheckIns(mockToken)).rejects.toThrow('Lỗi lấy danh sách check-in');
            });
        });

        describe('getCheckInById', () => {
            it('should fetch check-in by id successfully', async () => {
                const checkInId = '123';
                mockFetchSuccess();

                const result = await getCheckInById(checkInId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/checkins/${checkInId}`, {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getCheckInById('123', mockToken)).rejects.toThrow('Lỗi lấy check-in');
            });
        });

        describe('deleteCheckIn', () => {
            it('should delete check-in successfully', async () => {
                const checkInId = '123';
                mockFetchSuccess();

                const result = await deleteCheckIn(checkInId, mockToken);

                expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/admin/checkins/${checkInId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(deleteCheckIn('123', mockToken)).rejects.toThrow('Lỗi xóa check-in');
            });
        });
    });

    describe('Statistics', () => {
        describe('getStatistics', () => {
            it('should fetch statistics successfully', async () => {
                mockFetchSuccess();

                const result = await getStatistics(mockToken);

                expect(fetch).toHaveBeenCalledWith('http://localhost:3000/admin/statistics', {
                    headers: { Authorization: `Bearer ${mockToken}` }
                });
                expect(result).toEqual(mockResponse);
            });

            it('should throw error when request fails', async () => {
                mockFetchError();

                await expect(getStatistics(mockToken)).rejects.toThrow('Lỗi lấy thống kê');
            });
        });
    });
});