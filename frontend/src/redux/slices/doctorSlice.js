import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Initial state
const initialState = {
    doctors: [],
    selectedDoctor: null,
    loading: false,
    error: null,
    searchFilters: {
        name: '',
        specialty: '',
        location: '',
    },
    specialties: [
        'Cardiologist',
        'Dermatologist',
        'Neurologist',
        'Pediatrician',
        'Psychiatrist',
        'Orthopedic',
        'Gynecologist',
        'Ophthalmologist',
        'ENT Specialist',
        'General Physician',
    ],
};

// Async thunks
export const searchDoctors = createAsyncThunk(
    'doctors/searchDoctors',
    async (params, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();

            if (params.name) queryParams.append('name', params.name);
            if (params.specialty) queryParams.append('specialty', params.specialty);
            if (params.location) queryParams.append('location', params.location);


            const response = await axios.get(`${API_URL}/doctors/search?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search doctors');
        }
    }
);

export const getDoctorById = createAsyncThunk(
    'doctors/getDoctorById',
    async (id, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const response = await axios.get(`${API_URL}/doctors/${id}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get doctor details');
        }
    }
);


// Slice
const doctorSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        setSearchFilters: (state, action) => {
            state.searchFilters = { ...state.searchFilters, ...action.payload };
        },
        clearSearchFilters: (state) => {
            state.searchFilters = {
                name: '',
                specialty: '',
                location: '',
            };
        },
        clearSelectedDoctor: (state) => {
            state.selectedDoctor = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Search Doctors
            .addCase(searchDoctors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(searchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Doctor By ID
            .addCase(getDoctorById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDoctorById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedDoctor = action.payload;
                if (state.selectedDoctor && state.selectedDoctor._id === action.payload.doctorId) {
                    state.selectedDoctor.availabilitySlots = action.payload.slots;
                }
            })
            .addCase(getDoctorById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
    },
});

export const { setSearchFilters, clearSearchFilters, clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
