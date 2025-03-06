import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                                Your Health, <span className="text-blue-300">Our Priority</span>
                            </h1>
                            <p className="text-lg md:text-xl mb-8">
                                Discover trusted doctors, book appointments with ease, and manage your healthcare journey all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:space-x-4">
                                {!isAuthenticated && (
                                    <Link to="/register">
                                        <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition focus:outline-none focus:ring-4 focus:ring-blue-300 mt-4 sm:mt-0">
                                            Register Now
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                alt="Doctor with patient"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Find Doctors',
                                description: 'Search by specialty, location, or name to find the perfect match for your needs.',
                                icon: <Search className="h-12 w-12 text-blue-600" />,
                            },
                            {
                                title: 'Book Appointments',
                                description: 'Select available slots and book instantly. No more waiting on hold.',
                                icon: <Calendar className="h-12 w-12 text-blue-600" />,
                            },
                            {
                                title: 'Manage Schedule',
                                description: 'View, reschedule, or cancel appointments with ease.',
                                icon: <Clock className="h-12 w-12 text-blue-600" />,
                            },
                        ].map(({ title, description, icon }) => (
                            <div key={title} className="bg-blue-50 p-8 rounded-lg text-center shadow-lg hover:shadow-xl transition">
                                <div className="flex justify-center mb-6">{icon}</div>
                                <h3 className="text-xl font-semibold mb-4 text-blue-700">{title}</h3>
                                <p className="text-gray-600">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Specialties</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            'Cardiology',
                            'Dermatology',
                            'Neurology',
                            'Pediatrics',
                            'Psychiatry',
                            'Orthopedics',
                            'Gynecology',
                            'Ophthalmology',
                        ].map((specialty) => (
                            <div
                                key={specialty}
                                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition"
                            >
                                <h3 className="text-lg font-semibold text-blue-700">{specialty}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
