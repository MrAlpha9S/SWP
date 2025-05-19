import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (<button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
    </button>
    );
};

export default LogoutButton;