import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import {
    User, MapPin, Award, Calendar, Clock, ChevronLeft,
    ChevronRight, CheckCircle, XCircle
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getDoctorById, clearSelectedDoctor } from '../../redux/slices/doctorSlice';
import { useSelector } from 'react-redux';


const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedDoctor, loading, error } = useSelector((state) => state.doctors);
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [groupedSlots, setGroupedSlots] = useState({});



    // Group availableSlots by date
    useEffect(() => {
        if (selectedDoctor?.availabilitySlots) {
            const grouped = selectedDoctor.availabilitySlots.reduce((acc, curr) => {
                const date = format(parseISO(curr.date), 'yyyy-MM-dd');
                acc[date] = curr.slots;
                return acc;
            }, {});
            setGroupedSlots(grouped);
        }
    }, [selectedDoctor]);



    useEffect(() => {
        if (id) {
            dispatch(getDoctorById(id));
        }

    }, [dispatch, id]);


    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate);
        if (direction === 'next') {
            newDate.setDate(newDate.getDate() + 1);
        } else {
            if (new Date() < newDate)
                newDate.setDate(newDate.getDate() - 1);
        }
        setSelectedDate(newDate);
    };

    const formatDate = (date) => {
        return format(date, 'yyyy-MM-dd');
    };

    const handleBookAppointment = (slotId) => {

        if (!isAuthenticated) {
            toast.info('Please log in to book an appointment');
            navigate('/login');
            return;
        }

        if (user?.role !== 'patient') {
            toast.error('Only patients can book appointments');
            return;
        }

        navigate(`/book-appointment/${id}/${slotId}`);
    };

    if (loading) {
        return <div>Loading...</div>

    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!selectedDoctor) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-8 text-gray-500">
                    <p>Doctor not found.</p>
                </div>
            </div>
        );
    }


    const formattedSelectedDate = formatDate(selectedDate);

    const availableSlotsForDate = groupedSlots[formattedSelectedDate]?.filter((slot) => {
        const currentDate = new Date();
        const selectedSlotDate = new Date(formattedSelectedDate);

        if (selectedSlotDate.toDateString() === currentDate.toDateString()) {
            // If the selected date is today, compare slot time with current time
            const [hours, minutes] = slot.time.split(':').map(Number);
            const slotTime = new Date(selectedSlotDate);
            slotTime.setHours(hours, minutes);

            return slotTime > currentDate; // Only include slots in the future
        }

        return true; // Include all slots for future dates
    }) || [];



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Doctor Info */}
                <div className="p-6 border-b">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
                            <div className="bg-blue-100 rounded-full p-6">
                                <User className="h-24 w-24 text-blue-600" />
                            </div>
                        </div>

                        <div className="md:w-3/4 md:pl-6">
                            <h1 className="text-2xl font-bold text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h1>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-gray-700">
                                    <Award className="h-5 w-5 mr-2 text-blue-600" />
                                    <span>{selectedDoctor.specialization}</span>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <User className="h-5 w-5 mr-2 text-blue-600" />
                                    <span>{selectedDoctor.experience} years of experience</span>
                                </div>

                                {selectedDoctor.location && (
                                    <div className="flex items-start text-gray-700">
                                        <MapPin className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                                        <div>
                                            <h3 className="font-medium">Practice Location:</h3>
                                            <ul className="list-disc list-inside pl-2">
                                                {selectedDoctor.location}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability Calendar */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => handleDateChange('prev')}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <h3 className="text-lg font-medium">
                                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </h3>

                            <button
                                onClick={() => handleDateChange('next')}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {availableSlotsForDate.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                <p>No available slots for this date.</p>
                                <p className="text-sm mt-1">Please select another date or check back later.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableSlotsForDate.map((slot) => (
                                    <div
                                        key={slot._id}
                                        className={`border rounded-lg p-4 text-center ${!slot.isAvailable
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'hover:border-blue-500 cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex justify-center mb-2">
                                            <Clock className={`h-5 w-5 ${!slot.isAvailable ? 'text-gray-400' : 'text-blue-600'}`} />
                                        </div>
                                        <p className={`font-medium ${!slot.isAvailable ? 'text-gray-500' : 'text-gray-800'}`}>
                                            {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}

                                        </p>
                                        <div className="mt-2">
                                            {!slot.isAvailable ? (
                                                <div className="flex items-center justify-center text-gray-500 text-sm">
                                                    <XCircle className="h-4 w-4 mr-1 text-gray-400" />
                                                    <span>Booked</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center text-green-600 text-sm">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    <span>Available</span>
                                                </div>
                                            )}
                                        </div>
                                        {slot.isAvailable && (
                                            <button
                                                className="mt-3 w-full"
                                                onClick={() => handleBookAppointment(slot._id)}
                                            >
                                                Book
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;