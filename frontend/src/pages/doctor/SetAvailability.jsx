import React, { useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { toast } from 'react-toastify';
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Save,
} from 'lucide-react';

import {
    fetchAvailability,
    addTimeSlot,
    deleteTimeSlot,
    setSelectedDate,
    setNewSlot,
    clearAvailabilityState,
} from '../../redux/slices/availabilitySlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/reduxHooks';

const SetAvailability = () => {
    const dispatch = useAppDispatch();
    const {
        selectedDate,
        availabilitySlots,
        loading,
        error,
        success,
        newSlot,
    } = useSelector((state) => state.availability);
    const { user } = useSelector((state) => state.auth);

    async function fetchAvailabilitySlots() {
        const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd'); // Proper format
        dispatch(fetchAvailability({ id: user.id, selectedDate: formattedDate }));
    }

    useEffect(() => {
        dispatch(clearAvailabilityState());
        fetchAvailabilitySlots();
    }, [dispatch, selectedDate]);


    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate);
        if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        } else {
            if (newDate > new Date())
                newDate.setDate(newDate.getDate() - 1);
        }
        dispatch(setSelectedDate(format(newDate, 'yyyy-MM-dd')));
    };
    const handleNewSlotChange = (e) => {
        const { name, value } = e.target;
        dispatch(setNewSlot({ [name]: value }));
    };

    const validateTimeSlot = () => {
        if (!newSlot.startTime) {
            toast.error('Please fill in all fields');
            return false;
        }
        const start = parseISO(`2000-01-01T${newSlot.startTime}`);
        if (!isValid(start)) {
            toast.error('Invalid time format');
            return false;
        }

        for (const slot of availabilitySlots) {
            if (slot.time === newSlot.startTime) {
                toast.error('Time slot overlaps with an existing slot');
                return false;
            }
        }
        return true;
    };

    const addTimeSlotHandler = async () => {
        if (!validateTimeSlot()) return;

        try {
            await dispatch(addTimeSlot(newSlot)).unwrap();
            toast.success('Time slot added successfully');
            // Reset the `newSlot` state to clear the input
            dispatch(setNewSlot({ startTime: '' }));
            fetchAvailabilitySlots();
        } catch (err) {
            toast.error(error || 'Failed to add time slot');
        }
    };

    const deleteTimeSlotHandler = async (date, time) => {
        try {
            await dispatch(deleteTimeSlot({ date, time })).unwrap();
            toast.success('Time slot deleted successfully');
            fetchAvailabilitySlots();
        } catch (err) {
            toast.error(error || 'Failed to delete time slot');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Set Your Availability</h1>

            {/* Date Selector */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => handleDateChange('prev')}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <h2 className="text-lg font-medium flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h2>

                    <button
                        onClick={() => handleDateChange('next')}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="mt-6 border-t pt-6">
                    <h3 className="text-md font-medium mb-4 flex items-center">
                        <Plus className="h-4 w-4 mr-2 text-blue-600" />
                        Add New Time Slot
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <select
                                id="startTime"
                                name="startTime"
                                value={newSlot.startTime || ''}
                                onChange={handleNewSlotChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                {[...Array(24)].map((_, index) => {
                                    const slotTime = `${String(index).padStart(2, '0')}:00`;
                                    const currentDate = new Date();
                                    const selectedDateObj = new Date(selectedDate);

                                    // Only show future times for today
                                    if (
                                        selectedDateObj.toDateString() === currentDate.toDateString() &&
                                        index <= currentDate.getHours()
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <option key={index} value={slotTime}>
                                            {slotTime}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>


                        <div className="flex items-end">
                            <button
                                onClick={addTimeSlotHandler}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Adding...' : 'Add Slot'}
                            </button>

                        </div>

                    </div>
                </div>
            </div>


            {/* Time Slots List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">Available Time Slots</h2>
                </div>

                {loading && !error && availabilitySlots.length === 0 ? (
                    <div className="p-6">
                        <p>Loading slots...</p>
                    </div>
                ) : error || availabilitySlots.length === 0 ? (

                    <div div className="p-8 text-center">
                        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No time slots available</h3>
                        <p className="text-gray-500">
                            You haven't set any availability for {format(selectedDate, 'MMMM d, yyyy')}.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {availabilitySlots.map((slot, index) => (
                            <div key={index} className="p-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-blue-600 mr-3" />
                                        <span className="text-lg font-medium">{slot.time}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteTimeSlotHandler(selectedDate, slot.time)}
                                        className="flex items-center text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default SetAvailability;
