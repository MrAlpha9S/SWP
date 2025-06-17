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

export async function getPostsByCategoryTag(categoryTag) {
    try {
        const res = await fetch(`http://localhost:3000/social-posts/${categoryTag}`, {
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

export async function getPosts({categoryTag = '', keyword = '', page = 1, fromDate = '', toDate = '', postId = ''}) {
    try {

        const res = await fetch(`http://localhost:3000/social-posts?categoryTag=${categoryTag}&keyword=${keyword}&page=${page}&fromDate=${fromDate}&toDate=${toDate}&postId=${postId}`, {
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

export async function getComments({postId}) {
    try {

        const res = await fetch(`http://localhost:3000/social-posts/comments/${postId}`, {
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
        console.error('getComments error', error);
        throw error;
    }
}
