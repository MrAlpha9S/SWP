import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginInButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()} className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition">Log In</button>;

}

export default LoginInButton;
