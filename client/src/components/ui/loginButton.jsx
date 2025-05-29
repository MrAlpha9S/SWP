import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()} className="w-[100px] px-2 py-2 border border-primary-500 text-primary-500 rounded-md hover:text-white hover:bg-primary-500 transition">Đăng nhập</button>;

}

export default LoginButton;
