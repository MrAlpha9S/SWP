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
                const data = await postUserInfo(user, getAccessTokenSilently, isAuthenticated);
                if (!data.success) return navigate('/error');
                if (data.message.role === 'Admin') return navigate('/admin');

                const profileRes = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
                if (profileRes.success) {
                        await syncProfileToStores(profileRes.data);
                }

                const referrerPayment = localStorage.getItem("referrerPayment");
                if (referrerPayment) {
                    try {
                        const localReferrer = JSON.parse(referrerPayment);
                        if (localReferrer.referrer === 'subscriptionPagePayment') {
                            localStorage.removeItem('referrerPayment');
                            return navigate('/subscription');
                        } else if (localReferrer.referrer === 'subscriptionPagePaymentStep5') {
                            localStorage.removeItem('referrerPayment');
                            return navigate('/subscription/onboarding-step-5-payment');
                        }
                    } catch (e) {
                        console.error('Failed to redirect on payment referrer:', e);
                        return navigate('/');
                    }
                }

                const stored = localStorage.getItem('onboarding_profile');
                if (stored) {
                    try {
                        const localProfile = JSON.parse(stored);
                        if (localProfile.referrer === 'onboarding-step-5-payment') {
                            await syncProfileToStores(localProfile);
                            localStorage.removeItem('onboarding_profile');
                            useProfileExists.getState().setIsProfileExist(false);
                            return navigate('/subscription/onboarding-step-5-payment')
                        }
                        await syncProfileToStores(localProfile);
                        localStorage.removeItem('onboarding_profile');
                        useCurrentStepStore.getState().setCurrentStep(6);
                        useProfileExists.getState().setIsProfileExist(false);
                        if (localProfile.referrer.length > 0) {
                            if (localProfile.referrer === 'subscriptionPagePaidStep5') {
                                useCurrentStepStore.getState().setCurrentStep(5);
                                return navigate('/onboarding')
                            }
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
