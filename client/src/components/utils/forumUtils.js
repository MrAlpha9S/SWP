export async function getForumCategoryMetadata() {
    try {
        const res = await fetch('http://localhost:3000/social-posts/get-post-comment-count', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(errorMessage || `Request failed with status ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('getForumCategoryMetadata error', error);
        throw error;
    }
}
