import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginInButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()} className="w-[100px] px-2 py-2 border border-primary-500 text-primary-500 rounded-md hover:border-primary-600 hover:text-primary-600 transition">Đăng nhập</button>;

}

export default LoginInButton;
