import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerStore } from '../store/actions/storeActions';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link, useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/homepage/HeroBanner';
import Navbar from '../components/homepage/Navbar';
import { FooterPrime } from '../components/presentation/FooterPrime';
import { AllAbouJumiaFooter } from '../components/presentation/AllAbouJumiaFooter';
import ReCAPTCHA from 'react-google-recaptcha';
import ConfirmationModal from '../components/presentation/modals/ConfirmationStoreModal';
import { toast } from 'react-toastify';
import countriesData from "./countries.json";

const RegisterStore = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector((state) => state.store);
    const [emailAlert, setEmailAlert] = useState(false)
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (store?.store?.token) {
            toast.info("Please check your email for verification");
            setEmailAlert(true)
        }
    }, [store, navigate]);

    const [formData, setFormData] = useState({
        ownerFirstName: '',
        ownerLastName: '',
        name: '',
        description: '',
        address: '',
        location: { type: 'Point', coordinates: [0, 0] },
        phone: '',
        email: '',
        nationality: '',
        password: '',
        confirmPassword: '',
        photo: null,
        showPassword: false,
        showConfirmPassword: false,
        passwordStrength: '',
    });


    const mapRef = React.useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            photo: e.target.files[0],
        }));
    };

    useEffect(() => {
        const map = L.map(mapRef.current).setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([0, 0]).addTo(map);

        map.on('click', function (e) {
            const { lat, lng } = e.latlng;
            setFormData((prevState) => ({
                ...prevState,
                location: { type: 'Point', coordinates: [lng, lat] }
            }));
            marker.setLatLng([lat, lng]);
        });

        return () => {
            map.remove();
        };
    }, []);

    const togglePasswordVisibility = (field) => {
        setFormData((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const checkPasswordStrength = (password) => {
        if (password.length < 6) return 'Weak';
        if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[@$!%*?&]/)) return 'Strong';
        return 'Medium';
    };

    useEffect(() => {
        setFormData((prevState) => ({
            ...prevState,
            passwordStrength: checkPasswordStrength(prevState.password),
        }));
    }, [formData.password]);



    const handleSubmit = (e) => {
        e.preventDefault();

        const emailUsername = formData.email.split('@')[0].toLowerCase();

        // if (!captchaVerified) {
        //     toast.error('Please verify the captcha!');
        //     return;
        // }

        if (formData.password.toLowerCase().includes(emailUsername)) {
            toast.warning('Password must be different from your email!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.warning('Passwords do not match!');
            return;
        }
        setShowModal(true);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    };

    const handleConfirmRegistration = () => {
        const formDataToSend = new FormData();
        
        // Add fields to FormData
        for (let key in formData) {
            if (key === 'photo') {
                formDataToSend.append('photo', formData.photo);
            } else if (key === 'location') {
                formDataToSend.append('location', JSON.stringify(formData.location));
            } else if (key !== 'showPassword' && key !== 'showConfirmPassword' && key !== 'passwordStrength') {
                // Skip UI-only fields
                formDataToSend.append(key, formData[key]);
            }
        }
        
        // Add extra fields
        formDataToSend.append('ownerFullName', `${formData.ownerFirstName} ${formData.ownerLastName}`);
        
        // Debug FormData properly - this shows the actual content
      
        // Now actually dispatch to Redux action
        dispatch(registerStore(formDataToSend));
        setShowModal(false);
    };
    



    const handleCaptchaChange = (value) => {
        setCaptchaVerified(!!value);
    };


    const filteredCountries = countriesData.countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleOpenGmail = () => {
        window.open("https://mail.google.com/", "_blank");
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5FA]">
            <HeroBanner />
            <Navbar />
            <div className="md:w-1/2 text-center mb-8 ">
                <h1 className="text-4xl font-bold text-[#4222C4] mb-4 mt-10">Welcome to Our E-commerce Platform</h1>
                <p className="text-lg text-[#5E3BE1]">Register your store and start selling worldwide!</p>
            </div>
            <div className="md:w-[70%] bg-white p-8 rounded-lg shadow-md text-[#4222C4] w-full">
                <h2 className="text-2xl font-bold mb-4">Register Store</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Store Name" className="w-full p-3 border border-[#8970ee] rounded" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full p-3 border border-[#8970ee] rounded" required />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Store Address" className="w-full p-3 border border-[#8970ee] rounded" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Owner First Name"
                            className="w-full p-3 border border-[#8970ee] rounded"
                            value={formData.ownerFirstName}
                            onChange={(e) => setFormData((prevState) => ({
                                ...prevState,
                                ownerFirstName: e.target.value,
                            }))}
                        />
                        <input
                            type="text"
                            placeholder="Owner Last Name"
                            className="w-full p-3 border border-[#8970ee] rounded"
                            value={formData.ownerLastName}
                            onChange={(e) => setFormData((prevState) => ({
                                ...prevState,
                                ownerLastName: e.target.value,
                            }))}
                        />

                    </div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Store Description"
                        className="w-full p-3 border border-[#8970ee] rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full p-3 border border-[#8970ee] rounded"
                        required
                    />
                    <div className="relative w-full">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full p-3 border border-[#8970ee] rounded"
                        />

                        {/* Custom Dropdown */}
                        {showDropdown && (
                            <ul className="absolute w-full bg-white border border-gray-300 rounded max-h-40 overflow-y-auto z-10">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country, index) => (
                                        <li
                                            key={index}
                                            onClick={() => {
                                                handleChange({ target: { name: "nationality", value: country.name } });
                                                setSearchTerm(country.name);
                                                setShowDropdown(false);
                                            }}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            {country.name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-2 text-gray-500">No results found</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div className="relative">
                        <input type={formData.showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={`w-full p-3 border rounded ${formData.passwordStrength === 'Weak' ? 'border-red-500' :
                            formData.passwordStrength === 'Medium' ? 'border-yellow-500' :
                                formData.passwordStrength === 'Strong' ? 'border-green-500' : 'border-[#8970ee]'
                            }`} required />
                        <button type="button" onClick={() => togglePasswordVisibility('showPassword')} className="absolute right-3 top-3">👁</button>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${formData.passwordStrength === 'Weak' ? 'text-red-500' :
                        formData.passwordStrength === 'Medium' ? 'text-yellow-500' :
                            formData.passwordStrength === 'Strong' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                        Password Strength: {formData.passwordStrength}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        Password must be different from your email, at least 8 characters, and contain at least 3 of the following character types: uppercase letters, lowercase letters, and numbers.
                    </p>
                    <div className="relative">
                        <input type={formData.showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 border border-[#8970ee] rounded" required />
                        <button type="button" onClick={() => togglePasswordVisibility('showConfirmPassword')} className="absolute right-3 top-3">👁</button>
                    </div>

                    <div className="w-full">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                            Upload Profile Image (JPG, PNG)
                        </label>
                        <input
                            type="file"
                            name="photo"
                            id="photo"
                            onChange={handleFileChange}
                            className="w-full p-3 border border-[#8970ee] rounded"
                            accept="image/png, image/jpeg"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Max size: 500x500px</p>
                    </div>



                    <div className="h-64 border border-[#8970ee] rounded overflow-hidden">
                        <div ref={mapRef} className="h-full w-full z-0"></div>
                    </div>


                    <ReCAPTCHA
                        sitekey="6LfUINoqAAAAAJTgeARZZjXQv_bm9U962__BMVc8"
                        onChange={handleCaptchaChange}
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                    <button type="submit"
                        className="w-full bg-[#4222C4] text-white p-3 rounded hover:bg-[#3219A6]"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register Store"}
                    </button>

                </form>
                <p className="text-center text-sm mt-4">Already have an account? <Link to="/login-store" className="underline text-[#4222C4] font-bold">Login</Link></p>
            </div>
            <FooterPrime />
            <AllAbouJumiaFooter />

            <ConfirmationModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmRegistration}
            />


            {
                emailAlert && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Store Registration Verification
                            </h2>
                            <p className="text-gray-600 mt-2">
                                A verification message has been sent to your email. Please verify it.
                            </p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={() => setEmailAlert(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleOpenGmail}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Open Gmail
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


        </div>
    );
};

export default RegisterStore;
