const {getUserFcmTokenFromAuth0Id, getUserByAuth0Id} = require("../services/userService");
const {getMessaging} = require('firebase-admin/messaging');

const sendPushNotification = async (receiverUserAuth0Id, title, body, senderUserAuth0Id = null) => {
    const user = await getUserByAuth0Id(receiverUserAuth0Id)

    if (!user.fcm_token) return

    const message = {
        data: {
            title: title,
            body: body
        },
        token: user.fcm_token,
    };


    return getMessaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });

}

module.exports = {sendPushNotification};