import React from 'react';
import CoachDetailsPage from "../../../pages/subscriptionPage/coachDetailsPage.jsx";
import {useAuth0} from "@auth0/auth0-react";

const UserReviews = () => {
    const {user} = useAuth0()
    return (
        <div className='w-full h-full'>
            <CoachDetailsPage coachId={user?.sub} from={'coach'}/>
        </div>
    );
};

export default UserReviews;