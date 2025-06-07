import React, { useState } from 'react'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'
import Logo from './homepage/logo.jsx'
import LoginButton from "../ui/loginButton.jsx";
import LogoutButton from "../ui/logoutButton.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import SignUpButton from "../ui/signUpButton.jsx";
import Profile from "../ui/userProfile.jsx";
import { FaSpinner } from "react-icons/fa";
import TopicsDropdown from "./topics.jsx";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isAuthenticated, isLoading } = useAuth0();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-primary-800 shadow-sm sticky top-0 z-50 py-2">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16 gap-5">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex justify-between items-center w-full">
                        <div className="w-[50%] flex gap-10">
                            <a href="/" className="text-white hover:text-primary-500 font-medium transition-colors">
                                Trang chủ
                            </a>
                            <a href="/" className="text-white hover:text-primary-500 font-medium transition-colors">
                                Cộng đồng
                            </a>
                            <a href="/" className="text-white hover:text-primary-500 font-medium transition-colors">
                                Hỗ trợ
                            </a>
                            <a href="/" className="text-white hover:text-primary-500 font-medium transition-colors">
                                <TopicsDropdown />
                            </a>

                        </div>

                        <div className="flex justify-end gap-2 h-full w-[50%]">
                            {isLoading ? (
                                <FaSpinner icon="spinner" className="spinner size-10" color="white" />
                            ) : isAuthenticated ? (
                                <Profile />
                            ) : (
                                <>
                                    <SignUpButton />
                                    <LoginButton />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Search and Mobile Menu Button */}
                    <div className="flex items-center">
                        <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full">
                            <FiSearch className="w-5 h-5" />
                        </button>
                        <button
                            className="ml-4 md:hidden p-2 text-gray-500 hover:text-primary-600 transition-colors rounded-full"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
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
                        <LoginButton />
                        <LogoutButton />
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar