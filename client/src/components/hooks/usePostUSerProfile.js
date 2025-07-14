import { useMutation } from '@tanstack/react-query';

export const usePostUserProfile = (getAccessTokenSilently, user) => {
    return useMutation({
        mutationFn: async (payload) => {
            const token = await getAccessTokenSilently();

            const response = await fetch('http://localhost:3000/profiles/postOnboarding', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to post user profile');
            }

            return response.json();
        }
    });
};
