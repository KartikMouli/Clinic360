import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/footer';


import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DoctorSearch from './pages/patient/DoctorSearch';
import DoctorProfile from './pages/patient/DoctorProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AppointmentsList from './pages/doctor/AppointmentList';
import ManageLocations from './pages/doctor/ManageLocations';
import SetAvailability from './pages/doctor/SetAvailability';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className='flex-grow'>
          <Routes>

            {/* Home Route  */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes  */}

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route path="/search" element={<DoctorSearch />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment/:doctorId/:slotId"
              element={
                <ProtectedRoute role="patient">
                  <BookAppointment />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <ProtectedRoute role="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/availability"
              element={
                <ProtectedRoute role="doctor">
                  <SetAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/locations"
              element={
                <ProtectedRoute role="doctor">
                  <ManageLocations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute role="doctor">
                  <AppointmentsList />
                </ProtectedRoute>
              }
            />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router >
  );
}

export default App;