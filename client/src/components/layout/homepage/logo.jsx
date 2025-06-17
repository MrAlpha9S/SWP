import React from "react";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-white">
            <div className="flex items-center">
                <a onClick={() => navigate('/')} className="">
                    <img src='/logo.png' alt="Logo" className="w-30"/>
                </a>
            </div>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900"></span>
    </div>
  )
}

export default Logo