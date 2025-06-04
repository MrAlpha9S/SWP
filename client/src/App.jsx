
import { Routes, Route} from "react-router-dom";
import Navbar from './components/layout/navbar.jsx';
import './App.css';
import Homepage from './pages/homepage/homepage.jsx';
import DashBoard from "./pages/dashboardPage/dashboard.jsx";
import PostSignUpCallback from "./pages/signup/postSignUpCallback.jsx";
import Onboarding from "./pages/signup/onboarding.jsx";
import Footer from "./components/layout/footer.jsx";
import PostOnboardingCallback from "./pages/signup/postOnboardingCallback.jsx";

function App() {

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Homepage/>}></Route>
                <Route path="/dashboard" element={<DashBoard/>}></Route>
                <Route path="/postSignup" element={<PostSignUpCallback/>}></Route>
                <Route path="/onboarding" element={<Onboarding/>}></Route>
                <Route path="/postOnboarding" element={<PostOnboardingCallback/>}></Route>
            </Routes>
            <Footer/>
        </>
    )
}

export default App
