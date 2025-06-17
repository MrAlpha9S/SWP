import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserInfo } from "../../components/utils/userUtils.js";
import {getUserProfile, syncProfileToStores} from "../../components/utils/profileUtils.js"

export default function PostSignUpCallback() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePostSignup = async () => {
            if (!isAuthenticated || !user) return;

            console.log(user);

            const data = await postUserInfo(user, getAccessTokenSilently, isAuthenticated);
            if (data.success) {
                const profileRes = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
                const profile = profileRes?.data;

                await syncProfileToStores(profile)

                navigate('/dashboard');
            } else {
                navigate('/error');
            }
        };

        handlePostSignup();
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            Loading...
        </div>
    );
}
