export async function getSubscriptionList() {

    const res = await fetch('http://localhost:3000/subscription/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return await res.json();
}