import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './layouts/Navbar/navbar';
import './App.css';
import Home from './pages/homePage/home';
import Login from './pages/loginPage/login';
import Register from './pages/registerPage/register';
import dashBoard from './pages/dashboardPage/dashboard';

function App() {

  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
