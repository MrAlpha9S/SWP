import React, {useState} from 'react'
import {FiSearch, FiMenu, FiX} from 'react-icons/fi'
import Logo from './Logo'
import LoginInButton from "../ui/loginInButton.jsx";
import LogoutButton from "../ui/LogoutButton.jsx";
import {useAuth0} from "@auth0/auth0-react";
import SignUpButton from "../ui/signUpButton.jsx";
import Profile from "../ui/auth0_profile.jsx";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const {isAuthenticated} = useAuth0();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16 gap-5">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo/>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex justify-between items-center w-full">
                        <div className="w-full flex space-x-8">
                            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                Home
                            </a>
                            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                Community
                            </a>
                            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                                Support
                            </a>

                        </div>

                        <div className="flex space-x-8 h-12 w-72">
                            {isAuthenticated ? (
                                <>
                                    <Profile/>
                                    <LogoutButton/>
                                </>
                            ) : (
                                <>
                                    <LoginInButton/>
                                    <SignUpButton/>
                                </>
                            )}
                        </div>

                    </div>


                    {/* Search and Mobile Menu Button */}
                    <div className="flex items-center">
                        <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full">
                            <FiSearch className="w-5 h-5"/>
                        </button>
                        <button
                            className="ml-4 md:hidden p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <FiX className="w-6 h-6"/> : <FiMenu className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="container-custom py-3 space-y-3">
                        <a href="#"
                           className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Home
                        </a>
                        <a href="#"
                           className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Community
                        </a>
                        <a href="#"
                           className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                            Support
                        </a>
                        <LoginInButton/>
                        <LogoutButton/>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar