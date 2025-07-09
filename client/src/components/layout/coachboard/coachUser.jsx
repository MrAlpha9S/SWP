import React from 'react';
import Messager from "./messager/messager.jsx";
import {useUserInfoStore} from "../../../stores/store.js";

const CoachUser = () => {
    const {userInfo} = useUserInfoStore()

    return (
        <div className='w-full h-screen flex'>
            <div className='w-[50%] h-screen'><Messager role={userInfo?.role} /></div>
            <div className='w-[50%] h-screen bg-secondary-400'>

            </div>
        </div>
    );
};

export default CoachUser;