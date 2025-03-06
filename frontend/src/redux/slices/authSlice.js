import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password, role }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password, role });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            return { token, user };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ role, ...userData }, { rejectWithValue }) => {
        try {
            const endpoint = role === 'doctor' ? `${API_URL}/auth/register-doctor` : `${API_URL}/auth/register-patient`;
            const response = await axios.post(endpoint, userData);
            // console.log("response.data:",response.data)
            
            return response.data;

        } catch (error) {
            // console.log("error:",error)
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/auth/me`, config);
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            return rejectWithValue(error.response?.data?.message || 'Failed to load user');
        }
    }
);

// Initial state
const initialState = {
    user: null,
    token:  localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
    success:false
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.success = false;

        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success=false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.success = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success=false;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.success=true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success=false;
            })
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
                state.success=false;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
