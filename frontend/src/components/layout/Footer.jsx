import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Clinic360</h3>
                        <p className="text-gray-300 text-sm">
                            Connecting patients with the best healthcare professionals. Book appointments with ease and manage your healthcare journey.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-gray-300 hover:text-white">Find Doctors</Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <address className="text-gray-300 text-sm not-italic">
                            <p>123 Healthcare Avenue</p>
                            <p>Medical District, CA 90210</p>
                            <p className="mt-2">Email: support@clinic360.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </address>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Clinic360. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;