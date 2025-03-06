import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import locationReducer from './slices/locationSlice';
import availabilityReducer from './slices/availabilitySlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        doctors: doctorReducer,
        appointments: appointmentReducer,
        locations: locationReducer,
        availability: availabilityReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
