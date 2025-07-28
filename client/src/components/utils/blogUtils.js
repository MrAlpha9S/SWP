export async function postBlog(user, getAccessTokenSilently, isAuthenticated, topic, title, description, content, created_at) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();


    const res = await fetch('http://localhost:3000/topics/post_blog', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, topic: topic, title: title, description: description, content: content, created_at: created_at})
    });
    

    return await res.json();
}

export async function getPostedBlog(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch('http://localhost:3000/topics/getblog', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub})
    });
    

    return await res.json();
}

export async function getBlogById(id, token) {
  const res = await fetch(`http://localhost:3000/topics/getblogbyid/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Lỗi lấy blog');
  return await res.json();
}