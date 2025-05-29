import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (<button
        className="w-[100px] px-2 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Đăng xuất
    </button>
    );
};

export default LogoutButton;