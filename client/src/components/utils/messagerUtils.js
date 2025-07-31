import {getBackendUrl} from "./getBackendURL.js";


export async function CreateConversation(user, getAccessTokenSilently, isAuthenticated, conversation_name, created_at, user_id) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/messager/createconversation`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, conversation_name: conversation_name, created_at: created_at, user_id: user_id})
    });
    

    return await res.json();
}


export async function GetMessageConversations(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/messager/messageconversations`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub})
    });
    

    return await res.json();
}

export async function GetUserConversations(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/messager/userconversations`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub})
    });
    

    return await res.json();
}

export async function SendMessage(user,senderName, recipientAuth0Id, getAccessTokenSilently, isAuthenticated, conversationId, content, created_at) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/messager/sendmessage`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth0_id: user.sub, recipientAuth0Id: recipientAuth0Id, senderName: senderName, conversationId: conversationId, content: content, created_at: created_at})
    });
    

    return await res.json();
}