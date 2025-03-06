import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Search, MapPin, Award, User } from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useSelector } from 'react-redux';
import { clearSearchFilters, searchDoctors, setSearchFilters } from '../../redux/slices/doctorSlice'
import { SPECIALTIES, STATES } from '../../config/constants';


const DoctorSearch = () => {
    const dispatch = useAppDispatch();
    const { doctors, loading, error, searchFilters } = useSelector((state) => state.doctors);


    const [filters, setFilters] = useState({
        name: searchFilters.name || '',
        specialty: searchFilters.specialty || '',
        location: searchFilters.location || '',
    });

    useEffect(() => {
        // Initial search with any existing filters
        if (searchFilters.name || searchFilters.specialty || searchFilters.location) {
            dispatch(searchDoctors(searchFilters));
        }
    }, [dispatch, searchFilters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchFilters(filters));
        dispatch(searchDoctors(filters));
    };

    const handleClear = () => {
        setFilters({
            name: '',
            specialty: '',
            location: '',
        });
        dispatch(clearSearchFilters());

    };



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <form onSubmit={handleSearch}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            id="name"
                            name="name"
                            value={filters.name}
                            onChange={handleChange}
                            placeholder="Search by Name"
                            className="p-3 w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        <select
                            id="specialty"
                            name="specialty"
                            value={filters.specialty}
                            onChange={handleChange}
                            className="p-3 w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Search by Specialty</option>
                            {SPECIALTIES.map((specialty,index) => (
                                <option key={specialty || index} value={specialty}>
                                    {specialty}
                                </option>
                            ))}
                        </select>

                        <select
                            id="location"
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            className="p-3 w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Search by Location</option>
                            {STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end mt-6 space-x-4">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {doctors.length > 0
                        ? `Found ${doctors.length} doctor${doctors.length === 1 ? '' : 's'}`
                        : 'Search for doctors'}
                </h2>

                {loading ? (
                    <div className="py-8 text-center">
                        <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-8 h-8 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md">
                        {error}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No doctors found. Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {doctors.map((doctor, index) => (
                            <div
                                key={doctor._id || index}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-600">
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <Award className="h-4 w-4 mr-1" />
                                                <span>{doctor.specialization}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 mt-1">
                                                <User className="h-4 w-4 mr-1" />
                                                <span>{doctor.experience} years experience</span>
                                            </div>
                                            {doctor.location && (
                                                <div className="flex items-center text-gray-600 mt-1">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    <span>{doctor.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 md:mt-0">
                                            <Link to={`/doctor/${doctor._id}`}>
                                                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                    View Profile
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

    );
};

export default DoctorSearch;