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
import { useLanguage } from '../context/LanguageContext';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedLanguage, translateText } = useLanguage();
    const [translatedContent, setTranslatedContent] = useState({
        welcomeBack: "Welcome Back!",
        loginMessage: "Login to continue shopping your favorite products with exclusive discounts and free home delivery.",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginButton: "Login",
        loggingInButton: "Logging In...",
        forgotPassword: "Forgot Password?",
        noAccount: "Don't have an account?",
        signUp: "Sign Up",
        loginSuccess: "Login successful!",
        loginError: "Login failed"
    });

    const { loading, error, userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        const translateContent = async () => {
            const translations = await Promise.all([
                translateText("Welcome Back!"),
                translateText("Login to continue shopping your favorite products with exclusive discounts and free home delivery."),
                translateText("Email Address"),
                translateText("Enter your email"),
                translateText("Password"),
                translateText("Enter your password"),
                translateText("Login"),
                translateText("Logging In..."),
                translateText("Forgot Password?"),
                translateText("Don't have an account?"),
                translateText("Sign Up"),
                translateText("Login successful!"),
                translateText("Login failed")
            ]);

            setTranslatedContent({
                welcomeBack: translations[0],
                loginMessage: translations[1],
                emailLabel: translations[2],
                emailPlaceholder: translations[3],
                passwordLabel: translations[4],
                passwordPlaceholder: translations[5],
                loginButton: translations[6],
                loggingInButton: translations[7],
                forgotPassword: translations[8],
                noAccount: translations[9],
                signUp: translations[10],
                loginSuccess: translations[11],
                loginError: translations[12]
            });
        };

        translateContent();
    }, [selectedLanguage, translateText]);

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
                    <h2 className="text-4xl font-bold text-center text-[#4222C4] mb-6">
                        {translatedContent.welcomeBack}
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                        {translatedContent.loginMessage}
                    </p>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                {translatedContent.emailLabel}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder={translatedContent.emailPlaceholder}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {translatedContent.passwordLabel}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
                                placeholder={translatedContent.passwordPlaceholder}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#4222C4] text-white font-semibold rounded-md hover:bg-[#311B92] focus:outline-none focus:ring-2 focus:ring-[#4222C4] disabled:opacity-70"
                        >
                            {loading ? translatedContent.loggingInButton : translatedContent.loginButton}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/password/forgot" className="text-sm text-[#4222C4] hover:text-[#311B92]">
                        {translatedContent.forgotPassword}
                        </a>
                        <p className="text-sm text-gray-600 mt-3">
                        {translatedContent.noAccount}{' '}
                            <a href="/register" className="text-[#4222C4] hover:text-[#311B92] font-medium">
                            {translatedContent.signUp}
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
