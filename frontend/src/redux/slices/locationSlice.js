import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Initial state
const initialState = {
    location: null, 
    loading: false,
    error: null,
    success: false,
};

// Async thunks
export const getDoctorLocations = createAsyncThunk(
    'location/getDoctorLocation',
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/doctors/location/${id}`, config);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch location');
        }
    }
);

export const updateLocation = createAsyncThunk(
    'location/updateLocation',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`${API_URL}/doctors/location`, data, config);
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update location');
        }
    }
);

// Slice
const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        clearLocationState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Doctor Location
            .addCase(getDoctorLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDoctorLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.location = action.payload;
            })
            .addCase(getDoctorLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Location
            .addCase(updateLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.location = action.payload;
                state.success = true;
            })
            .addCase(updateLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearLocationState } = locationSlice.actions;
export default locationSlice.reducer;
