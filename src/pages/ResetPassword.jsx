import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../store/actions/userActions';
import { toast } from 'react-toastify';
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import { FooterPrime } from '../components/presentation/FooterPrime';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams(); // Get token from URL

    const { loading, error, success } = useSelector((state) => state.resetPassword);

    useEffect(() => {
        if (success) {
            toast.success('Password reset successful!');
            navigate('/login');
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        // Dispatch reset password action with token and passwords
        dispatch(resetPassword(token, { password, confirmPassword }));
    };

    return (
        <div>
            <HeroBanner />
            <Navbar />

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="p-10 rounded-lg shadow-xl w-full md:w-[70%]">
                    <h2 className="text-4xl font-bold text-center text-[#4222C4] mb-6">Reset Password</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Enter your new password below
                    </p>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder="Enter new password"
                                required
                                minLength="6"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder="Confirm new password"
                                required
                                minLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#4222C4] text-white font-semibold rounded-md hover:bg-[#311B92] focus:outline-none focus:ring-2 focus:ring-[#4222C4] disabled:opacity-70"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <a href="/login" className="text-[#4222C4] hover:text-[#311B92] font-medium">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <FooterPrime />
            <AllAbouJumiaFooter />
        </div>
    );
};

export default ResetPassword; 