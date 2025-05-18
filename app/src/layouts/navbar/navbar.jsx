import React from "react";
//import '../../styles/navbar.css'; // Import your CSS file

class Navbar extends React.Component {

    render() {
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
                        <a href="/login" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition">Sign in</a>
                        <a href="/register" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Sign Up</a>
                    </div>
                </div>
            </nav>


        );
    }
}

export default Navbar;