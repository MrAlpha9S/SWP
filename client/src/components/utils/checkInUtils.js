export async function postCheckIn(user, getAccessTokenSilently, isAuthenticated, checkInDate, feel, checkedQuitItems, freeText, qna, isFreeText, cigsSmoked, isStepOneOnYes, isJournalSelected) {

    if (!isAuthenticated || !user) return;

    const token = await getAccessTokenSilently();

    const bodyPayLoad = {
        userAuth0Id: user.sub,
        feel: feel,
    }

    if (isStepOneOnYes) {
        bodyPayLoad.checkedQuitItems = checkedQuitItems;
    } else {
        bodyPayLoad.cigsSmoked = cigsSmoked
    }
    if (isJournalSelected) {
        if (isFreeText) {
            bodyPayLoad.freeText = freeText;
        } else {
            bodyPayLoad.qna = qna
        }
    }

    const res = await fetch('http://localhost:3000/check-in/post-check-in', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayLoad)
    });

    return await res.json();
}