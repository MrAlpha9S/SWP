import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/navbar/navbar';
import './App.css';
import Home from './pages/homePage/home';
import dashBoard from './pages/dashboardPage/dashboard';

function App() {

  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/dashboard" element={<dashBoard />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
