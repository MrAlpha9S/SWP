
import { Routes, Route } from "react-router-dom";
import Navbar from './components/layout/navbar.jsx';
import './App.css';
import Homepage from './pages/homepage/homepage.jsx';
import DashBoard from "./pages/dashboardPage/dashboard.jsx";
import PostSignUpCallback from "./pages/signup/postSignUpCallback.jsx";
import Onboarding from "./pages/signup/onboarding.jsx";
import Footer from "./components/layout/footer.jsx";
import PostOnboardingCallback from "./pages/signup/postOnboardingCallback.jsx";
import CheckIn from "./pages/dashboardPage/checkIn.jsx";
import MyProfile from "./pages/dashboardPage/myProfile.jsx";
import ErrorPage from "./pages/errorPage.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {getUserProfile, syncProfileToStores} from "./components/utils/profileUtils.js";
import {useEffect} from "react";

function App() {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const syncOnLoad = async () => {
            if (!isAuthenticated || !user) return;
            const result = await getUserProfile(user, getAccessTokenSilently, isAuthenticated);
            if (result?.data) {
                await syncProfileToStores(result.data);
            }
        };

        syncOnLoad();
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/dashboard/check-in" element={<CheckIn />} />
                <Route path="/post-signup" element={<PostSignUpCallback />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/error" element={<ErrorPage />} />
                <Route path="/post-onboarding" element={<PostOnboardingCallback/>}></Route>
                <Route path="/my-profile" element={<MyProfile/>}></Route>
            </Routes>
            <Footer />
        </>
    )
}

export default App
