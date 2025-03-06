import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { loadUser } from '../../redux/slices/authSlice';

const ProtectedRoute = ({ children, role }) => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading, user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated && !loading && token) {
            dispatch(loadUser());
        }
    }, [dispatch, isAuthenticated, loading, token]);

    if (loading) {
        return <div className="div">Loading ...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
