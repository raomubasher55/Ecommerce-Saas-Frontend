import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Forgetpassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { selectedLanguage, translateText } = useLanguage();

    const [translatedContent, setTranslatedContent] = useState({
        title: "Forgot Password",
        emailLabel: "Email Address",
        emailPlaceholder: "Enter your email",
        buttonText: "Send Reset Link",
        defaultError: "Something went wrong",
        successMessage: ""
    });

    useEffect(() => {
        const translateContent = async () => {
            const translations = await Promise.all([
                translateText("Forgot Password"),
                translateText("Email Address"),
                translateText("Enter your email"),
                translateText("Send Reset Link"),
                translateText("Something went wrong")
            ]);

            setTranslatedContent({
                title: translations[0],
                emailLabel: translations[1],
                emailPlaceholder: translations[2],
                buttonText: translations[3],
                defaultError: translations[4],
                successMessage: message ? await translateText(message) : ""
            });
        };

        translateContent();
    }, [selectedLanguage, translateText, message]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_APP}/api/v1/password/forgot`, { email });
            const translatedMessage = await translateText(data.message);
            setMessage(translatedMessage);
            setError('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || translatedContent.defaultError;
            const translatedError = await translateText(errorMsg);
            setError(translatedError);
            setMessage('');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center text-purple-700 mb-4">
                    {translatedContent.title}
                </h2>
                {message && <div className="text-green-500 text-center mb-4">{message}</div>}
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            {translatedContent.emailLabel}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder={translatedContent.emailPlaceholder}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {translatedContent.buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Forgetpassword;