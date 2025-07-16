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

export async function getPosts({ categoryTag = '', keyword = '', page = 1, fromDate = '', toDate = '', postId = '', auth0_id, currentUserId = null }) {
    try {
        if (auth0_id) {

            const res = await fetch(`http://localhost:3000/social-posts?categoryTag=${categoryTag}&keyword=${keyword}&page=${page}&fromDate=${fromDate}&toDate=${toDate}&postId=${postId}&auth0_id=${auth0_id}&currentUserId=${currentUserId}`, {
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
        } else {
            const auth0_null = ''
            const res = await fetch(`http://localhost:3000/social-posts?categoryTag=${categoryTag}&keyword=${keyword}&page=${page}&fromDate=${fromDate}&toDate=${toDate}&postId=${postId}&auth0_id=${auth0_null}&currentUserId=${currentUserId}`, {
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
        }


    } catch (error) {
        console.error('getForumCategoryMetadata error', error);
        throw error;
    }
}

export async function getComments({ postId, currentUserId }) {
    try {

        const res = await fetch(`http://localhost:3000/social-posts/comments/${postId}/${currentUserId}`, {
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

export async function PostSocialPosts(user, getAccessTokenSilently, isAuthenticated, category_id, title, content, created_at) {
    console.log(category_id, title, content, created_at)

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/social-posts/post-socialposts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category_id: category_id, auth0_id: user.sub, title: title, content: content, created_at: created_at })
    });


    return await res.json();
}

export async function UpdateSocialPosts(user, getAccessTokenSilently, isAuthenticated, post_id, category_id, title, content, created_at) {
    console.log('UpdateSocialPosts: ', post_id, category_id, title, content, created_at)

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/social-posts/update`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: post_id, category_id: category_id, title: title, content: content, created_at: created_at })
    });


    return await res.json();
}

export async function DeleteSocialPosts(user, getAccessTokenSilently, isAuthenticated, post_id) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/social-posts/delete`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ post_id: post_id})
    });


    return await res.json();
}

export const AddComment = async (user, getAccessTokenSilently, isAuthenticated, parent_comment_id, post_id, content, created_at, is_reported) => {
    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/social-posts/addcomment`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parent_comment_id: parent_comment_id, auth0_id: user.sub, post_id: post_id, content: content, created_at: created_at, is_reported: is_reported })
    });

    return await res.json();
};

export const AddLike = async (user, getAccessTokenSilently, isAuthenticated, post_id, comment_id, created_at) => {

    if (!isAuthenticated || !user) return;
    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/social-posts/like`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, post_id: post_id, comment_id: comment_id, created_at: created_at})
    });

    return await res.json();
};
