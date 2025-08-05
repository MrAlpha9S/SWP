const express = require('express');
const userRouter = express.Router();
const checkJwt = require('../middlewares/jwtChecker');
const {getAllUsersController, handlePostSignup, getUserCreationDate, updateUserSubscription,
    getCoachesController, getCoachByIdController, assignUserToCoachController, getUserNotesController,
    createUserNoteController, updateUserNoteController, getAllReviewsController, createReviewController,
    updateReviewController, deleteReviewController, handleUpdateUserFCMToken, sendPushNotificationTo,
    handleUpdateUserTimesForPush, getLeaderboardStats, handleCoachRegistration, handleGetCoachRegistrationInfo,
    deleteUserNoteController, findUserByEmail, fixUserAuth0Id, alreadyHaveSub
} = require("../controllers/userController");
const { getUserInfo, updateUserInfo, updateUserController} = require("../controllers/userController");
const {handleAllMember} = require("../controllers/userController");
userRouter.get('/getAllUsers', checkJwt, getAllUsersController);
userRouter.post('/token', checkJwt, handleUpdateUserFCMToken)
userRouter.post('/send-push-notification', checkJwt, sendPushNotificationTo)
userRouter.post('/push-notification-times', checkJwt, handleUpdateUserTimesForPush)
userRouter.post('/postSignup', checkJwt, handlePostSignup);
userRouter.get('/get-user-creation-date', checkJwt, getUserCreationDate)
userRouter.patch('/update-user', checkJwt, updateUserController)
userRouter.get('/info', checkJwt, getUserInfo);
userRouter.put('/info', checkJwt, updateUserInfo);
userRouter.post('/update-subscription', checkJwt, updateUserSubscription)
userRouter.get('/get-coaches', getCoachesController)
userRouter.get('/coaches/:coachId', getCoachByIdController)
userRouter.post('/assign-coach', checkJwt, assignUserToCoachController)
userRouter.get('/getAllMembers', checkJwt, handleAllMember);
userRouter.put('/notes', checkJwt, updateUserNoteController);
userRouter.post('/notes', checkJwt, createUserNoteController);
userRouter.delete('/notes/:noteId', checkJwt, deleteUserNoteController);
userRouter.get('/notes/:userAuth0Id', checkJwt, getUserNotesController);
userRouter.get('/coach-reviews/:userAuth0Id/:coachAuth0Id',checkJwt, getAllReviewsController);
userRouter.post('/coach-reviews',checkJwt, createReviewController);
userRouter.put('/coach-reviews',checkJwt, updateReviewController);
userRouter.delete('/coach-reviews/:reviewId', checkJwt,deleteReviewController);
userRouter.get('/leaderboard', getLeaderboardStats)
userRouter.get('/subscription-check/:userAuth0Id', checkJwt, alreadyHaveSub)

// Coach registration routes
userRouter.post('/coach/register', checkJwt, handleCoachRegistration);
userRouter.get('/coach/registration-info', checkJwt, handleGetCoachRegistrationInfo);

// Route để tìm user theo email (cho debug)
userRouter.get('/find-by-email', findUserByEmail);

// Route để sửa Auth0 ID cho user (cho admin)
userRouter.post('/fix-auth0-id', fixUserAuth0Id);


module.exports = userRouter;