import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getDoctorById } from '../../redux/slices/doctorSlice';
import { bookAppointment, clearAppointmentState } from '../../redux/slices/appointmentSlice';

const BookAppointment = () => {
    const { doctorId, slotId } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedDoctor, loading: doctorLoading } = useSelector((state) => state.doctors);
    const { loading: bookingLoading, error, success } = useSelector((state) => state.appointments);
    const { user } = useSelector((state) => state.auth);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState(null)

    useEffect(() => {
        if (doctorId) {
            dispatch(getDoctorById(doctorId));
        }
        dispatch(clearAppointmentState());
    }, [dispatch, doctorId]);

  

    useEffect(() => {
        if (selectedDoctor?.availabilitySlots && slotId) {
            for (let it of selectedDoctor.availabilitySlots) {
                
                for (let slot of it.slots) {
                  
                    if (slot._id === slotId) {
                        setSelectedSlot(slot);
                        setAppointmentDate(it.date)
                        break;
                    }
                }
            }
        }
    }, [selectedDoctor, slotId]);


    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (success) {
            toast.success('Appointment booked successfully!');
            dispatch(clearAppointmentState());
            navigate('/patient/dashboard');
        }
    }, [error, success, navigate]);

    const handleConfirmBooking = () => {
        if (!selectedSlot) {
            toast.error('No slot selected');
            return;
        }

        const bookingData = {
            doctorId,
            patientId: user.id,
            appointmentDate: appointmentDate,
            startTime: selectedSlot.time,
        };

        dispatch(bookAppointment(bookingData));
    };

    if (doctorLoading || !selectedDoctor || !selectedSlot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                    <h1 className="text-2xl font-bold">Confirm Your Appointment</h1>
                    <p className="mt-2">Please review the details before confirming</p>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Doctor Information</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="font-medium text-gray-800">
                                Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                            </p>
                            <p className="text-gray-600">{selectedDoctor?.specialization}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                                {/* <span>{format(parseISO(appointmentDate), 'yyyy-MM-dd')}</span> */}
                                {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                            </div>

                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                <span>
                                    {selectedSlot?.time}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                                <div>
                                    <p className="font-medium">Location:</p>
                                    <p>{selectedDoctor?.location || "Doctor's office"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Patient Information</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p>Your information will be shared with the doctor's office.</p>
                        </div>
                    </div>

                    <div className="border-t pt-6 flex justify-between">
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                            onClick={() => navigate(-1)}
                            disabled={bookingLoading}
                        >
                            Back
                        </button>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={bookingLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
