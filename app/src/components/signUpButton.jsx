import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() =>
                loginWithRedirect({
                    screen_hint: "signup", 
                })
            }
        >
            Sign Up
        </button>
    );
};

export default SignUpButton;
