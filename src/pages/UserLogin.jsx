import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import { FooterPrime } from '../components/presentation/FooterPrime';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (userInfo) {
            toast.success('Login successful!');
            navigate('/');
            window.location.reload()
        }
        if (error) {
            toast.error(error);
        }
    }, [navigate, userInfo, error]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <div>
            <HeroBanner />
            <Navbar />

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="p-10 rounded-lg shadow-xl w-full md:w-[70%]">
                    <h2 className="text-4xl font-bold text-center text-[#4222C4] mb-6">Welcome Back!</h2>
                    <p className="text-center text-gray-600 mb-8">
                        Login to continue shopping your favorite products with exclusive discounts and free home delivery.
                    </p>
                    
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#4222C4] text-white font-semibold rounded-md hover:bg-[#311B92] focus:outline-none focus:ring-2 focus:ring-[#4222C4] disabled:opacity-70"
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/password/forgot" className="text-sm text-[#4222C4] hover:text-[#311B92]">
                            Forgot Password?
                        </a>
                        <p className="text-sm text-gray-600 mt-3">
                            Don't have an account?{' '}
                            <a href="/register" className="text-[#4222C4] hover:text-[#311B92] font-medium">
                                Sign Up
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

export default UserLogin;
