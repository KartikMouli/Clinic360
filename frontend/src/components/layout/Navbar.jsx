import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Menu, X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/', { replace: true });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            Clinic360
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition duration-200"
                        >
                            Home
                        </Link>


                        {isAuthenticated && user.role === 'patient' && (
                            <div className='flex p-2 gap-x-7'>
                                <Link
                                    to="/patient/dashboard"
                                    className="text-gray-700 hover:text-blue-600 transition duration-200"
                                >
                                    My Appointments
                                </Link>
                                <Link
                                    to="/search"
                                    className="text-gray-700 hover:text-blue-600 transition duration-200"
                                >
                                    Find Doctors
                                </Link>

                            </div>
                        )}
                        {isAuthenticated && user.role === 'doctor' && (
                            <>
                                <Link
                                    to="/doctor/dashboard"
                                    className="text-gray-700 hover:text-blue-600 transition duration-200"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/doctor/availability"
                                    className="text-gray-700 hover:text-blue-600 transition duration-200"
                                >
                                    Availability
                                </Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">{user?.firstName}</span>
                                <UserCircle className="h-6 w-6 text-gray-500" />
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-50 shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        <Link
                            to="/"
                            className="block text-gray-700 hover:text-blue-600"
                            onClick={toggleMenu}
                        >
                            Home
                        </Link>
                        <Link
                            to="/search"
                            className="block text-gray-700 hover:text-blue-600"
                            onClick={toggleMenu}
                        >
                            Find Doctors
                        </Link>
                        {isAuthenticated && user.role === 'patient' && (
                            <Link
                                to="/patient/dashboard"
                                className="block text-gray-700 hover:text-blue-600"
                                onClick={toggleMenu}
                            >
                                My Appointments
                            </Link>
                        )}
                        {isAuthenticated && user.role === 'doctor' && (
                            <>
                                <Link
                                    to="/doctor/dashboard"
                                    className="block text-gray-700 hover:text-blue-600"
                                    onClick={toggleMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/doctor/availability"
                                    className="block text-gray-700 hover:text-blue-600"
                                    onClick={toggleMenu}
                                >
                                    Availability
                                </Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    toggleMenu();
                                }}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={toggleMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    onClick={toggleMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
