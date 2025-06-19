const API = 'http://localhost:3000/messager'

export async function SendMessage(user, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/messager/sendmessage`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, conversationId: conversationId, content: content, created_at: created_at})
    });
    

    return await res.json();
}