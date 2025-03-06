import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { format, parseISO, isPast } from "date-fns";
import { toast } from "react-toastify";
import {
    Calendar,
    Filter,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { getPatientAppointments, cancelAppointment } from "../../redux/slices/appointmentSlice";

const PatientDashboard = () => {
    const dispatch = useAppDispatch();
    const { appointments, loading, error, success } = useSelector((state) => state.appointments);
    const { user } = useSelector((state) => state.auth);

    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (user?.id) {
            dispatch(getPatientAppointments(user.id));
        }
    }, [dispatch, user?.id, success]);

    const handleCancelAppointment = (appointmentId) => {
        dispatch(cancelAppointment(appointmentId));
        dispatch(getPatientAppointments(user.id));
        toast.success("Appointment cancelled successfully");
    };

    const filteredAppointments = appointments.filter((appointment) => {

        if (!appointment.appointmentDate) {
            return false;
        }

        const appointmentDate = parseISO(appointment.appointmentDate);
        const isPastAppointment = isPast(appointmentDate);

        switch (filter) {
            case "upcoming":
                return !isPastAppointment && appointment.status !== "Canceled";
            case "past":
                return isPastAppointment && appointment.status !== "Canceled";
            case "cancelled":
                return appointment.status === "Canceled";
            default:
                return true;
        }
    });

    const sortedAppointments = filteredAppointments.sort((a, b) =>
        new Date(a.appointmentDate) - new Date(b.appointmentDate)
    );

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="max-w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-600 mt-1">Manage your upcoming and past appointments</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link to="/search">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book New Appointment
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700 font-medium">Filter:</span>
                    <div className="ml-4 flex flex-wrap items-center sm:space-y-0 sm:space-x-2">
                        {["all", "upcoming", "past", "cancelled"].map((filterOption) => (
                            <button
                                key={filterOption}
                                onClick={() => setFilter(filterOption)}
                                className={`px-3 py-1 rounded-full text-sm ${filter === filterOption
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                {sortedAppointments.length === 0 ? (
                    <div className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No appointments found
                        </h3>
                        <p className="text-gray-500">
                            {filter === "all"
                                ? "You don't have any appointments yet."
                                : `You don't have any ${filter} appointments.`}
                        </p>
                        {filter !== "all" && (
                            <button
                                onClick={() => setFilter("all")}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View all appointments
                            </button>
                        )}
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 ">
                            {sortedAppointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                Dr. {appointment.doctorId.firstName}{" "}
                                                {appointment.doctorId.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {appointment.doctorId.specialization}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {format(parseISO(appointment.appointmentDate), "MMM d, yyyy")}{" "}
                                        at {appointment.startTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {appointment.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {appointment.status !== "Canceled" && (
                                            <button
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
