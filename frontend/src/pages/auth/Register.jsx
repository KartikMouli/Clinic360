import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useSelector } from "react-redux";
import { clearError, register,resetSuccess } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SPECIALTIES, STATES } from "../../config/constants";
import { UserPlus } from "lucide-react";


const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        specialty: '',
        experience: '',
        location: '',
    });

    const [passwordError, setPasswordError] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.auth);


    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (success) {
            toast.success('Registration successful! Redirecting to login...');
            navigate('/login');
            dispatch(resetSuccess());
        }
    }, [success, dispatch, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear password error when either password field changes
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Frontend field validation
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'role'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field} is required`);
                return;
            }
        }


        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        // Validate doctor-specific fields
        if (formData.role === 'doctor') {
            if (!formData.specialty) {
                toast.error('Please select a specialty');
                return;
            }
            if (!formData.experience) {
                toast.error('Please enter your years of experience');
                return;
            }
            if (!formData.location) {
                toast.error('Please enter your location');
                return;
            }
        }

        // Prepare data for submission
        const userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            ...(formData.role === 'doctor' && {
                specialty: formData.specialty,
                experience: parseInt(formData.experience, 10),
                location: formData.location,
            }),
        };

        dispatch(register(userData));


    };

    return (
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create an Account</h2>
                    <p className="text-gray-600">Join Clinic360 today</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                placeholder="First Name"
                                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                placeholder="Last Name"
                                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Email Address"
                            className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm Password"
                            className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />

                        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="" disabled>
                                Select Your Role
                            </option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>

                        {formData.role === 'doctor' && (
                            <>
                                <select
                                    id="specialty"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    required
                                    className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Select your Specialty
                                    </option>
                                    {SPECIALTIES.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Select your location
                                    </option>
                                    {STATES.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                    placeholder="Years of Experience"
                                    min="1"
                                    className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />


                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center px-4 py-2 text-white font-medium rounded-md shadow-sm transition-all ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Creating Account...' : <><UserPlus className="mr-2 h-5 w-5" /> Create Account</>}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
