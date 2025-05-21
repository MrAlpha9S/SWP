
import { Routes, Route} from "react-router-dom";
import Navbar from './components/layout/navbar/navbar';
import './App.css';
import Home from './pages/homePage/home';
import DashBoard from "./pages/dashboardPage/dashboard";

function App() {

    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/dashboard" element={<DashBoard/>}></Route>
            </Routes>
        </>
    )
}

export default App
