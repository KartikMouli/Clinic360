import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MapPin } from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getDoctorLocations, updateLocation, clearLocationState } from '../../redux/slices/locationSlice';
import { STATES } from '../../config/constants';


const ManageLocations = () => {
    const dispatch = useAppDispatch();
    const { location, loading, error, success } = useSelector((state) => state.locations);
    const { user } = useSelector((state) => state.auth);

    const [selectedState, setSelectedState] = useState('');

    useEffect(() => {
        dispatch(getDoctorLocations(user.id));
    }, [dispatch]);

    useEffect(() => {
        if (location) {
            setSelectedState(location.name || '');
        }
    }, [location]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearLocationState());
        }

        if (success) {
            toast.success('Location updated successfully');
            dispatch(clearLocationState());
        }
    }, [error, success, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate selected state
        if (!selectedState) {
            toast.error('Please select a valid location');
            return;
        }

        dispatch(updateLocation({ id: user.id, location: selectedState }));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Location</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Update Your Location</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Location
                        </label>
                        <select
                            id="location"
                            name="location"
                            className="border rounded p-2 w-full"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select a state
                            </option>
                            {STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center'>
                            {loading ? 'Updating...' : 'Update Location'}
                        </button>
                    </div>
                </form>
            </div>

            {location && (
                <div className="p-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Office Location: {location}</h3>

                </div>
            )}
        </div>
    );
};

export default ManageLocations;
