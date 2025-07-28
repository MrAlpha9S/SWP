import {getBackendUrl} from "./getBackendURL.js";

export async function getNotifications(user, getAccessTokenSilently, isAuthenticated, page = 1, limit = 10, activeTab) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const res = await fetch(`${getBackendUrl()}/notifications?userAuth0Id=${user.sub}&page=${page}&limit=${limit}&type=${activeTab}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await res.json();
}

export async function createNotification(user, getAccessTokenSilently, isAuthenticated, { noti_title, content }) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const res = await fetch(`${getBackendUrl()}/notifications`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userAuth0Id: user.sub,
            noti_title,
            content
        })
    });

    return await res.json();
}

export async function deleteAllNotifications(user, getAccessTokenSilently, isAuthenticated) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const res = await fetch(`${getBackendUrl()}/notifications?userAuth0Id=${user.sub}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await res.json();
}

export async function markNotificationAsRead(user, getAccessTokenSilently, isAuthenticated, noti_id) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const res = await fetch(`${getBackendUrl()}/notifications/mark-read`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ noti_id })
    });

    return await res.json();
}

export async function markAllNotificationsAsRead(user, getAccessTokenSilently, isAuthenticated, type = null) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const body = {
        userAuth0Id: user.sub
    };
    if (type) body.type = type;

    const res = await fetch(`${getBackendUrl()}/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return await res.json();
}

export async function getUnreadCount(user, getAccessTokenSilently, isAuthenticated, type = null) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();
    const url = new URL(`${getBackendUrl()}/notifications/unread-count`);
    url.searchParams.append('userAuth0Id', user.sub);
    if (type) url.searchParams.append('type', type);

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return await res.json();
}
