import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { format } from 'date-fns';
import { API_URL } from '../../config/constants';


const initialState = {
    selectedDate: new Date(),
    availabilitySlots: [],
    loading: false,
    error: null,
    success: false,
    newSlot: {
        startTime: '09:00',
    },
};

// Async Thunks
export const fetchAvailability = createAsyncThunk(
    'availability/fetchAvailability',
    async ({ id, selectedDate }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('Authentication required');


            const response = await axios.get(`${API_URL}/doctors/${id}/availability/${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
        }
    }
);

export const addTimeSlot = createAsyncThunk(
    'availability/addTimeSlot',
    async (_, { getState, rejectWithValue }) => {
        try {
           
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('Authentication required');

            const { newSlot, selectedDate } = getState().availability;

            const formattedDate = format(selectedDate, 'yyyy-MM-dd');

            const response = await axios.post(`${API_URL}/availability/add`, {
                date: formattedDate,
                startTime: newSlot.startTime,
            }, { headers: { Authorization: `Bearer ${token}` } });


            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add time slot');
        }
    }
);

export const deleteTimeSlot = createAsyncThunk(
    'availability/deleteTimeSlot',
    async (payload, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('Authentication required');

            const { date, time } = payload;
            const formattedDate = format(date, 'yyyy-MM-dd');

            await axios.delete(`${API_URL}/availability/${formattedDate}/${time}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return payload; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete time slot');
        }
    }
);

const availabilitySlice = createSlice({
    name: 'availability',
    initialState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        setNewSlot: (state, action) => {
            state.newSlot = { ...state.newSlot, ...action.payload };
        },
        clearAvailabilityState: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailability.fulfilled, (state, action) => {
                state.loading = false;
                state.availabilitySlots = action.payload;
            })
            .addCase(fetchAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addTimeSlot.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(addTimeSlot.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(addTimeSlot.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            .addCase(deleteTimeSlot.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTimeSlot.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteTimeSlot.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setSelectedDate, setNewSlot, clearAvailabilityState } = availabilitySlice.actions;
export default availabilitySlice.reducer;
