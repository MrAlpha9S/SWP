import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostSignUpCallback() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [onboardingStatus, setOnboardingStatus] = useState(null);
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const postUserInfo = async () => {
            if (!isAuthenticated || !user) return;

            const token = await getAccessTokenSilently();

            const res = await fetch('http://localhost:3000/postSignup', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userAuth0Id: user.sub })
            });

            const data = await res.json();
            setOnboardingStatus(data.success);
            setMsg(data.message)
        };

        postUserInfo();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        if (onboardingStatus === true || onboardingStatus === false) {
            navigate('/dashboard');
        }
    }, [onboardingStatus, navigate, msg]);

    return <div className='h-screen w-screen'>{onboardingStatus}</div>;
}
