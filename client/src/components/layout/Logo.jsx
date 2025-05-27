import React from "react";

function Logo() {
  return (
    <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100">
            <div className="flex items-center">
                <a href="/client/public">
                    <img src='/logo.jpg' alt="Logo" className="w-30"/>
                </a>
            </div>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900"></span>
    </div>
  )
}

export default Logo