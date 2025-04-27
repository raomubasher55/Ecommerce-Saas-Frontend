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
import { useLanguage } from '../context/LanguageContext';

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

    const { selectedLanguage, translateText } = useLanguage();

    const [translatedContent, setTranslatedContent] = useState({
        welcomeTitle: "Welcome to Our E-commerce Platform",
        welcomeSubtitle: "Register your store and start selling worldwide!",
        registerTitle: "Register Store",
        namePlaceholder: "Store Name",
        emailPlaceholder: "Email",
        addressPlaceholder: "Store Address",
        ownerFirstName: "Owner First Name",
        ownerLastName: "Owner Last Name",
        storeDescription: "Store Description",
        phonePlaceholder: "Phone Number",
        passwordPlaceholder: "Password",
        passwordConfirmPlaceholder: "Confirm Password",
        passwordStrength: "Password Strength",
        passwordWeak: "Weak",
        passowrdMedium: "Medium",
        passwordStrong: "Strong",
        passowrdMessage: "Password must be different from your email, at least 8 characters, and contain at least 3 of the following character types: uppercase letters, lowercase letters, and numbers.",
        imageLabel: "Upload Profile Image (JPG, PNG)",
        imageSize: "Max size: 500x500px",
        registerStore: "Register Store",
        alreadyAccount: "Already have an account?",
        login: "Login",
        searchCountry: "Search Country ...",
        noResult: "No Result Found",
        registering: "Registering"
    });

    useEffect(() => {
        const translateContent = async () => {
            const translations = await Promise.all([
                translateText("Welcome to Our E-commerce Platform"),
                translateText("Register your store and start selling worldwide!"),
                translateText("Register Store"),
                translateText("Store Name"),
                translateText("Email"),
                translateText("Store Address"),
                translateText("Owner First Name"),
                translateText("Owner Last Name"),
                translateText("Store Description"),
                translateText("Phone Number"),
                translateText("Password"),
                translateText("Confirm Password"),
                translateText("Password Strength"),
                translateText("Weak"),
                translateText("Medium"),
                translateText("Strong"),
                translateText("Password must be different from your email, at least 8 characters, and contain at least 3 of the following character types: uppercase letters, lowercase letters, and numbers."),
                translateText("Upload Profile Image (JPG, PNG)"),
                translateText("Max size: 500x500px"),
                translateText("Register Store"),
                translateText("Already have an account?"),
                translateText("Login"),
                translateText("Search Country ..."),
                translateText("No Result Found"),
                translateText("Registering")
            ]);

            setTranslatedContent({
                welcomeTitle: translations[0],
                welcomeSubtitle: translations[1],
                registerTitle: translations[2],
                namePlaceholder: translations[3],
                emailPlaceholder: translations[4],
                addressPlaceholder: translations[5],
                ownerFirstName: translations[6],
                ownerLastName: translations[7],
                storeDescription: translations[8],
                phonePlaceholder: translations[9],
                passwordPlaceholder: translations[10],
                passwordConfirmPlaceholder: translations[11],
                passwordStrength: translations[12],
                passwordWeak: translations[13],
                passowrdMedium: translations[14],
                passwordStrong: translations[15],
                passowrdMessage: translations[16],
                imageLabel: translations[17],
                imageSize: translations[18],
                registerStore: translations[19],
                alreadyAccount: translations[20],
                login: translations[21],
                searchCountry: translations[22],
                noResult: translations[23],
                registering: translations[24]
            });
        };

        translateContent();
    }, [selectedLanguage, translateText]);



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
        for (let key in formData) {
            if (key === 'photo') {
                formDataToSend.append('photo', formData.photo);
            } else if (key === 'location') {
                formDataToSend.append('location', JSON.stringify(formData.location));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }


        formDataToSend.append('ownerFullName', `${formData.ownerFirstName} ${formData.ownerLastName}`);

        dispatch(registerStore(formDataToSend));
        setShowModal(false);
    };

    const filteredCountries = countriesData.countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5FA]">
            <HeroBanner />
            <Navbar />
            <div className="md:w-1/2 text-center mb-8 ">
                <h1 className="text-4xl font-bold text-[#4222C4] mb-4 mt-10">{translatedContent.welcomeTitle}</h1>
                <p className="text-lg text-[#5E3BE1]">{translatedContent.welcomeSubtitle}</p>
            </div>
            <div className="md:w-[70%] bg-white p-8 rounded-lg shadow-md text-[#4222C4] w-full">
                <h2 className="text-2xl font-bold mb-4">{translatedContent.registerStore}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={translatedContent.namePlaceholder} className="w-full p-3 border border-[#8970ee] rounded" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={translatedContent.emailPlaceholder} className="w-full p-3 border border-[#8970ee] rounded" required />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder={translatedContent.addressPlaceholder} className="w-full p-3 border border-[#8970ee] rounded" required />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={translatedContent.ownerFirstName}
                            className="w-full p-3 border border-[#8970ee] rounded"
                            value={formData.ownerFirstName}
                            onChange={(e) => setFormData((prevState) => ({
                                ...prevState,
                                ownerFirstName: e.target.value,
                            }))}
                        />
                        <input
                            type="text"
                            placeholder={translatedContent.ownerLastName}
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
                        placeholder={translatedContent.storeDescription}
                        className="w-full p-3 border border-[#8970ee] rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={translatedContent.phonePlaceholder}
                        className="w-full p-3 border border-[#8970ee] rounded"
                        required
                    />
                    <div className="relative w-full">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder={translatedContent.searchCountry}
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
                                    <li className="p-2 text-gray-500">{translatedContent.noResult}</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div className="relative">
                        <input type={formData.showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder={translatedContent.passwordPlaceholder} className={`w-full p-3 border rounded ${formData.passwordStrength === 'Weak' ? 'border-red-500' :
                            formData.passwordStrength === 'Medium' ? 'border-yellow-500' :
                                formData.passwordStrength === 'Strong' ? 'border-green-500' : 'border-[#8970ee]'
                            }`} required />
                        <button type="button" onClick={() => togglePasswordVisibility('showPassword')} className="absolute right-3 top-3">👁</button>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${formData.passwordStrength === 'Weak' ? 'text-red-500' :
                        formData.passwordStrength === 'Medium' ? 'text-yellow-500' :
                            formData.passwordStrength === 'Strong' ? 'text-green-500' : 'text-gray-500'
                        }`}>
                        {translatedContent.passwordStrength} : {formData.passwordStrength}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                        {translatedContent.passowrdMessage}
                    </p>
                    <div className="relative">
                        <input type={formData.showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 border border-[#8970ee] rounded" required />
                        <button type="button" onClick={() => togglePasswordVisibility('showConfirmPassword')} className="absolute right-3 top-3">👁</button>
                    </div>

                    <div className="w-full">
                        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                            {translatedContent.imageLabel}
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
                        <p className="text-xs text-gray-500 mt-1">{translatedContent.imageSize}</p>
                    </div>



                    <div className="h-64 border border-[#8970ee] rounded overflow-hidden">
                        <div ref={mapRef} className="h-full w-full z-0"></div>
                    </div>


                    <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                    />
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

                    <button type="submit"
                        className="w-full bg-[#4222C4] text-white p-3 rounded hover:bg-[#3219A6]"
                        disabled={isLoading}
                    >
                        {isLoading ? translatedContent.registering : translatedContent.registerStore}
                    </button>

                </form>
                <p className="text-center text-sm mt-4">{translatedContent.alreadyAccount} <Link to="/login-store" className="underline text-[#4222C4] font-bold">{translatedContent.login}</Link></p>
            </div>
            <FooterPrime />
            <AllAbouJumiaFooter />

            <ConfirmationModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmRegistration}
            />


            {emailAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Store Registration Verification
                        </h2>
                        <p className="text-gray-600 mt-3 text-sm md:text-base leading-relaxed">
                            Please check your email (including the <span className="font-semibold text-black">Spam or Junk folder</span>) to verify your registration.
                            <br />
                            If you use <span className="font-medium">Gmail, Yahoo, Hotmail</span>, or any other provider, open your inbox and follow the verification link we sent.
                        </p>

                        <div className="mt-6 flex items-center justify-center">
                            <button
                                onClick={() => setEmailAlert(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

export default RegisterStore;
