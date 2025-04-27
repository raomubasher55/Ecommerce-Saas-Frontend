import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStore } from '../store/actions/storeActions';
import { Link, useNavigate } from 'react-router-dom'; 
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { FooterPrime } from '../components/presentation/FooterPrime';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';

const StoreLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state) => state.store);
    const { loading, error } = useSelector(state => state); 
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginStore(formData)); 
    };

    useEffect(() => {
        if (store.user?.token) {
          navigate('/shopdashboard');
        }
      }, [store.user?.token, navigate]);

    return (
<div className="w-full bg-white rounded-lg shadow-lg text-[#4222C4] flex flex-col items-center">
<HeroBanner />
<Navbar />
    <h2 className="text-3xl font-bold mt-10 mb-4 text-center">Welcome Back!</h2>
    <p className="text-lg text-center mb-6">Login to your store account and continue growing your business.</p>
    <h2 className="text-2xl font-bold mb-6">Store Login</h2>

    <div className="md:w-[70%] bg-white p-8 rounded-lg shadow-md text-[#4222C4] w-full">
<form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="store@example.com"
                className="w-full p-3 mt-1 bg-gray-200 rounded text-[#4222C4] border border-[#8970ee] focus:ring-1 focus:ring-[#4222C4] outline-none"
                required
            />
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="password123"
                className="w-full p-3 mt-1 bg-gray-200 rounded text-[#4222C4] border border-[#8970ee] focus:ring-1 focus:ring-[#4222C4] outline-none"
                required
            />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded ${loading ? 'bg-gray-300' : 'bg-[#4222C4]'} hover:bg-[#33199D] text-white`}
        >
            {loading ? 'Logging In...' : 'Login'}
        </button>
    </form>

    <p className="text-center text-sm mt-4 text-gray-600">
        Don't have an account?{' '}
        <Link to="/register-store" className="text-[#4222C4] hover:underline">
            Register Store
        </Link>
    </p>
</div>

    <FooterPrime />
    <AllAbouJumiaFooter />
</div>

    );
};

export default StoreLogin;
