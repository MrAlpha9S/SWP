import { useMutation } from '@tanstack/react-query';
import { postGoal, deleteGoal } from '../utils/profileUtils.js';

export const usePostGoalMutation = (openNotification, setIsModalOpen, action = null) => {
    const postGoalMutation = useMutation({
        mutationFn: async ({
                               goalId,
                               editableGoalName,
                               editableGoalAmount,
                               user,
                               getAccessTokenSilently,
                               isAuthenticated,
                               completedDate,
                               isCompleted,
                           }) => {
            return await postGoal(
                goalId,
                editableGoalName,
                editableGoalAmount,
                user,
                getAccessTokenSilently,
                isAuthenticated,
                completedDate,
                isCompleted
            );
        },
        onSuccess: () => {
            openNotification('success', {
                message: 'Lưu mục tiêu thành công',
            });
            setIsModalOpen(false);
        },
        onError: () => {
            openNotification('failed', 'Lưu mục tiêu thất bại');
            setIsModalOpen(false);
        },
    });

    const deleteGoalMutation = useMutation({
        mutationFn: async ({ goalId, user, getAccessTokenSilently, isAuthenticated }) => {
            return await deleteGoal(goalId, user, getAccessTokenSilently, isAuthenticated);
        },
        onSuccess: () => {
            openNotification('delete-success');
            setIsModalOpen(false);
        },
        onError: () => {
            openNotification('delete-failed');
            setIsModalOpen(false);
        },
    });

    if (action === 'delete') return deleteGoalMutation;
    return postGoalMutation;
};


