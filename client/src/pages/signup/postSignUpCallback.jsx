import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserInfo } from "../../components/utils/userUtils.js";
import { getUserProfile, syncProfileToStores } from "../../components/utils/profileUtils.js";
import {useCurrentStepStore, useProfileExists} from "../../stores/store.js";

export default function PostSignUpCallback() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (!isAuthenticated || !user) return;

            try {
                // Step 1: Send user info to backend
                const data = await postUserInfo(user, getAccessTokenSilently, isAuthenticated);
                if (!data.success) return navigate('/error');

                // Step 2: Get profile from backend
                const profileRes = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
                if (profileRes.success) {
                        await syncProfileToStores(profileRes.data);
                }

                const stored = localStorage.getItem('onboarding_profile');
                if (stored) {
                    console.log(stored);
                    try {
                        const localProfile = JSON.parse(stored);
                        await syncProfileToStores(localProfile);
                        localStorage.removeItem('onboarding_profile');
                        useCurrentStepStore.getState().setCurrentStep(6);
                        useProfileExists.getState().setIsProfileExist(false);
                        if (localProfile.referrer.length > 0) {
                            return navigate(`/onboarding/${localProfile.referrer}`);
                        }
                    } catch (e) {
                        console.error('Failed to restore onboarding profile:', e);
                        return navigate('/');
                    }
                }

                // Step 4: Go to dashboard by default
                navigate('/dashboard');
            } catch (error) {
                console.error('PostSignUpCallback error:', error);
                navigate('/error');
            }
        };

        handleAuthCallback();
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            Loading...
        </div>
    );
}
