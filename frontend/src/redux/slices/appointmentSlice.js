import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/constants';


// Async thunks
export const getPatientAppointments = createAsyncThunk(
    'appointments/getPatientAppointments',
    async (id, { rejectWithValue, getState }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/appointments/patient/${id}`, config);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get appointments');
        }
    }
);

export const getDoctorAppointments = createAsyncThunk(
    'appointments/getDoctorAppointments',
    async (id, { rejectWithValue }) => {
        try {
            
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/appointments/doctor/${id}`, config);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get appointments');
        }
    }
);

export const bookAppointment = createAsyncThunk(
    'appointments/bookAppointment',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${API_URL}/appointments/book`, data, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
        }
    }
);

export const cancelAppointment = createAsyncThunk(
    'appointments/cancelAppointment',
    async (appointmentId, { rejectWithValue }) => {
        try {

            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(
                `${API_URL}/appointments/cancel`,
                { appointmentId },
                config
            );

            return response.data;


        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
        }
    }
);

// Slice
const appointmentSlice = createSlice({
    name: 'appointments',
    initialState: {
        appointments: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearAppointmentState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Patient Appointments
            .addCase(getPatientAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatientAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getPatientAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // // Get Doctor Appointments
            .addCase(getDoctorAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDoctorAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getDoctorAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Book Appointment
            .addCase(bookAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(bookAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // Cancel Appointment
            .addCase(cancelAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(cancelAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;