import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import {
    Calendar, Clock, MapPin, User, Filter,
    ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { getDoctorAppointments } from '../../redux/slices/appointmentSlice';


const AppointmentsList = () => {
    const dispatch = useAppDispatch();
    const { appointments, loading, error } = useSelector((state) => state.appointments);
    const { user } = useSelector((state) => state.auth);


    const [filter, setFilter] = useState('all'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 10;

    useEffect(() => {
        dispatch(getDoctorAppointments(user.id));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);



    // Filter and search appointments
    const filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointmentDate);
        const isPastAppointment = isPast(appointmentDate);
        


        switch (filter) {
            case 'upcoming':
                return !isPastAppointment && appointment.status !== 'Canceled';
            case 'past':
                return isPastAppointment && appointment.status !== 'Canceled';
            case 'today':
                return isToday(appointmentDate) && appointment.status !== 'Canceled';
            case 'cancelled':
                return appointment.status === 'Canceled';
            default:
                return true;
        }
    });

    // Sort appointments by date and time
    const sortedAppointments = [...filteredAppointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });

    // Pagination
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = sortedAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(sortedAppointments.length / appointmentsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading && appointments.length === 0) {
        return <div>Loading ...</div>;
        
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Appointments</h1>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Filter className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700 font-medium mr-4">Filter:</span>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'upcoming', label: 'Upcoming' },
                                { id: 'today', label: 'Today' },
                                { id: 'past', label: 'Past' },
                                { id: 'cancelled', label: 'Cancelled' }
                            ].map((filterOption) => (
                                <button
                                    key={filterOption.id}
                                    onClick={() => setFilter(filterOption.id)}
                                    className={`px-3 py-1 rounded-full text-sm ${filter === filterOption.id
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filterOption.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Appointments List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {currentAppointments.length === 0 ? (
                    <div className="p-8 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? "No appointments match your search."
                                : filter === 'all'
                                    ? "You don't have any appointments yet."
                                    : `You don't have any ${filter} appointments.`}
                        </p>
                        {(filter !== 'all' || searchTerm) && (
                            <button
                                onClick={() => {
                                    setFilter('all');
                                    setSearchTerm('');
                                }}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View all appointments
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Location
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentAppointments?.map((appointment) => {
                                        const appointmentDate = parseISO(appointment.appointmentDate);
                                        const isPastAppointment = isPast(appointmentDate);

                                        return (
                                            <tr key={appointment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <User className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment.patientId.firstName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                                            {format(appointmentDate, 'MMM d, yyyy')}
                                                            {isToday(appointmentDate) && (
                                                                <span className="ml-1 text-blue-600 font-medium">(Today)</span>
                                                            )}
                                                            {isTomorrow(appointmentDate) && (
                                                                <span className="ml-1 text-green-600 font-medium">(Tomorrow)</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                                            {format(parseISO(`2000-01-01T${appointment.startTime}`), 'h:mm a')}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                                                        {appointment.locationName || 'Your Office'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {appointment.status === 'scheduled' ? (
                                                        isPastAppointment ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                                Completed
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Upcoming
                                                            </span>
                                                        )
                                                    ) : appointment.status === 'cancelled' ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Cancelled
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {appointment.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{indexOfFirstAppointment + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(indexOfLastAppointment, sortedAppointments.length)}
                                            </span>{' '}
                                            of <span className="font-medium">{sortedAppointments.length}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(index + 1)}
                                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === index + 1
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentsList;