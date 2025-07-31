import {getBackendUrl} from "./getBackendURL.js";

export async function getSubscriptionList() {

    const res = await fetch(`${getBackendUrl()}/subscription/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}