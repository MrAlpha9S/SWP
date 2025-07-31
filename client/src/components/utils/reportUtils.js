import {getBackendUrl} from "./getBackendURL.js";

export async function AddReport(user, getAccessTokenSilently, isAuthenticated, post_id, comment_id, reason, description, created_at) {
    console.log('AddReport', user.sub, post_id, comment_id, reason, description, created_at)

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/reports/addreport`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ auth0_id: user.sub, post_id: post_id, comment_id: comment_id, reason: reason, description: description, created_at: created_at })
    });


    return await res.json();
}

export async function GetReports(user, getAccessTokenSilently, isAuthenticated) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/reports/getreports`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });


    return await res.json();
}

export async function DeleteReport(user, getAccessTokenSilently, isAuthenticated, report_id) {
    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const res = await fetch(`${getBackendUrl()}/reports/deletereport`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ report_id: report_id})
    });


    return await res.json();
}