import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            className="w-[100px] px-2 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>
            Đăng ký
        </button>
    );
};

export default SignUpButton;
