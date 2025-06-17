export async function postBlog(user, getAccessTokenSilently, isAuthenticated, topic, title, description, content, create_at) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/topics/post_blog', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, topic: topic, title: title, description: description, content: content, create_at: create_at})
    });

    return await res.json();
}