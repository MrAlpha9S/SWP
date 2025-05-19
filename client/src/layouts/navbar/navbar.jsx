import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginInButton from "../../components/loginInButton";
import LogoutButton from "../../components/LogoutButton";
import SignUpButton from "../../components/signUpButton";

function NavbarWithAuth0(props) {
    const { isAuthenticated } = useAuth0();
    return <Navbar isAuthenticated={isAuthenticated} {...props} />;
}

class Navbar extends React.Component {
    render() {
        const { isAuthenticated } = this.props;
        return (
            <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
                <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center">
                        <a href="/">
                            <img src='/logo.jpg' alt="Logo" className="w-30" />
                        </a>
                    </div>
                    {/* Menu */}
                    <ul className="hidden md:flex space-x-6 text-gray-600 font-medium">
                        <li><a href="/" className="hover:text-blue-500 transition">Home</a></li>
                        <li><a href="/" className="hover:text-blue-500 transition">About</a></li>
                        <li><a href="/" className="hover:text-blue-500 transition">Contact</a></li>
                    </ul>
                    {/* Right-side buttons */}
                    <div className="hidden md:flex space-x-3">
                        {isAuthenticated ? (
                            <LogoutButton />
                        ) : (
                            <>
                                <LoginInButton />
                                <SignUpButton />
                            </>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavbarWithAuth0;