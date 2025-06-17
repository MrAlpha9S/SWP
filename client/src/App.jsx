import {Routes, Route} from "react-router-dom";
import Navbar from './components/layout/navbar.jsx';
import './App.css';
import Homepage from './pages/homepage/homepage.jsx';
import DashBoard from "./pages/dashboardPage/dashboard.jsx";
import PostSignUpCallback from "./pages/signup/postSignUpCallback.jsx";
import Onboarding from "./pages/signup/onboarding.jsx";
import PostOnboardingCallback from "./pages/signup/postOnboardingCallback.jsx";
import MyProfile from "./pages/dashboardPage/myProfile.jsx";
import ErrorPage from "./pages/errorPage.jsx";
import {useAuth0} from "@auth0/auth0-react";
import {getUserProfile, syncProfileToStores} from "./components/utils/profileUtils.js";
import {useEffect} from "react";
import ForumPage from "./pages/forumPage/forumPage.jsx";
import ThreadDiscussion from "./components/layout/forum/ThreadDiscussion.jsx";
import CheckIn from "./pages/dashboardPage/checkInPage/checkIn.jsx";
import Footer from "./components/layout/footer.jsx";
import QuitExperiences from "./components/layout/forum/quitExperiences.jsx";


function App() {
    const {isAuthenticated, user, getAccessTokenSilently} = useAuth0();

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
            <Navbar/>
            <div className="max-w-[1280px] mx-auto bg-[#fff7e5]">
                <Routes>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/dashboard" element={<DashBoard/>}/>
                    <Route path="/dashboard/check-in/:date" element={<CheckIn/>}/>
                    <Route path="/post-signup" element={<PostSignUpCallback/>}/>
                    <Route path="/onboarding/:from?" element={<Onboarding/>}/>
                    <Route path="/error" element={<ErrorPage/>}/>
                    <Route path="/post-onboarding" element={<PostOnboardingCallback/>}></Route>
                    <Route path="/my-profile" element={<MyProfile/>}></Route>
                    <Route path="/forum" element={<ForumPage/>}></Route>
                    <Route path="/forum/quit-experiences" element={<QuitExperiences/>}></Route>
                    <Route path="/forum/thread/:threadId" element={<ThreadDiscussion/>}/>
                </Routes>
            </div>
            <Footer/>
        </>
    )
}

export default App
