export async function AddReport(user, getAccessTokenSilently, isAuthenticated, post_id, comment_id, reason, description, created_at) {
    console.log('AddReport', user.sub, post_id, comment_id, reason, description, created_at)

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`http://localhost:3000/reports/addreport`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ auth0_id: user.sub ,post_id: post_id,  comment_id: comment_id, reason: reason, description: description, created_at: created_at })
    });


    return await res.json();
}