
import { Routes, Route} from "react-router-dom";
import Navbar from './components/layout/Navbar.jsx';
import './App.css';
import Home from './pages/homePage/home';
import DashBoard from "./pages/dashboardPage/dashboard";
import PostSignUpRedirect from "./pages/PostSignUpRedirect.jsx";

function App() {

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/dashboard" element={<DashBoard/>}></Route>
                <Route path="/onboarding" element={<PostSignUpRedirect/>}></Route>
            </Routes>
        </>
    )
}

export default App
