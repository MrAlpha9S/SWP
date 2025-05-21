import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

function DashBoard() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg text-gray-700">This is a simple dashboard layout.</p>
        </div>
    );
}

export default withAuthenticationRequired(DashBoard)