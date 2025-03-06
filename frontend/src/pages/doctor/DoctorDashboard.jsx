import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format, parseISO, isToday, isTomorrow, addDays, startOfDay } from 'date-fns';
import {
    Calendar, Clock, User, MapPin, BarChart2,
    Users, ChevronRight
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getDoctorAppointments } from '../../redux/slices/appointmentSlice';


const DoctorDashboard = () => {
    const dispatch = useAppDispatch();
    const { appointments, loading } = useSelector((state) => state.appointments);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getDoctorAppointments(user.id));
    }, [dispatch]);

   

    // Filter today's appointments
    const todayAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointmentDate);
        return isToday(appointmentDate) && appointment.status !== 'Canceled';
    });

  

    // Filter upcoming appointments (next 7 days excluding today)
    const upcomingAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointmentDate);
        const today = startOfDay(new Date());
        const nextWeek = addDays(today, 7);

        return (
            !isToday(appointmentDate) &&
            appointmentDate >= today &&
            appointmentDate < nextWeek &&
            appointment.status !== 'Canceled'
        );
    });

    // Sort appointments by time
    const sortedTodayAppointments = [...todayAppointments].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime);
    });

    // Sort upcoming appointments by date and time
    const sortedUpcomingAppointments = [...upcomingAppointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });

    // Calculate statistics
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
        app => app.status === 'scheduled' && parseISO(app.appointmentDate) < new Date()
    ).length;
    const cancelledAppointments = appointments.filter(
        app => app.status === 'Canceled'
    ).length;

    if (loading && appointments.length === 0) {
        return <div> Loading...</div>
    }

   

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, Dr. {user?.firstName} {user?.lastName}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link to="/doctor/availability" className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-blue-700">Set Availability</h2>
                            <p className="text-sm text-gray-600 mt-1">Manage your working hours</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                </Link>

                <Link to="/doctor/locations" className="bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-green-700">Manage Locations</h2>
                            <p className="text-sm text-gray-600 mt-1">Add or edit practice locations</p>
                        </div>
                        <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                </Link>

                <Link to="/doctor/appointments" className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-purple-700">View All Appointments</h2>
                            <p className="text-sm text-gray-600 mt-1">See your complete schedule</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-600" />
                    </div>
                </Link>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
                    Appointment Statistics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-blue-700">{totalAppointments}</div>
                        <div className="text-sm text-gray-600">Total Appointments</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-green-700">{completedAppointments}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-red-700">{cancelledAppointments}</div>
                        <div className="text-sm text-gray-600">Cancelled</div>
                    </div>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Today's Appointments
                    </h2>

                    <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                {sortedTodayAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No appointments scheduled for today.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedTodayAppointments.length>0 && sortedTodayAppointments.map((appointment,index) => (
                            <div key={appointment.id||index} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {appointment?.patientId?.firstName}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {format(parseISO(`2000-01-01T${appointment.startTime}`), 'h:mm a')}
                                                
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {appointment.locationName || 'Your Office'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Upcoming Appointments
                    </h2>

                    <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                {sortedUpcomingAppointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No upcoming appointments in the next 7 days.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedUpcomingAppointments.slice(0, 5).map((appointment,index) => (
                            <div key={appointment.id || index} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {/* {appointment.patientName} */}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {format(parseISO(appointment.appointmentDate), "MMM d, yyyy")}
                                                {isTomorrow(parseISO(appointment.appointmentDate)) && (
                                                    <span className="ml-1 text-blue-600 font-medium">(Tomorrow)</span>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {format(parseISO(`2000-01-01T${appointment.startTime}`), 'h:mm a')} 
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {appointment.locationName || 'Your Office'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sortedUpcomingAppointments.length > 5 && (
                            <div className="text-center pt-2">
                                <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View {sortedUpcomingAppointments.length-5} more upcoming appointments
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;