import {getBackendUrl} from "./getBackendURL.js";

export async function getAllReviews(user, getAccessTokenSilently, isAuthenticated, userAuth0Id, coachAuth0Id) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/users/coach-reviews/${userAuth0Id}/${coachAuth0Id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return res.json();
}

export async function createReview(user, getAccessTokenSilently, isAuthenticated, userAuth0Id, coachAuth0Id, stars, content, username) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/users/coach-reviews`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userAuth0Id,
            coachAuth0Id,
            stars,
            content,
            username
        })
    });

    return res.json();
}

export async function updateReview(user, getAccessTokenSilently, isAuthenticated, reviewId, stars, content) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/users/coach-reviews`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reviewId,
            stars,
            content
        })
    });

    return res.json();
}

export async function deleteReview(user, getAccessTokenSilently, isAuthenticated, reviewId) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/users/coach-reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return res.json();
}

