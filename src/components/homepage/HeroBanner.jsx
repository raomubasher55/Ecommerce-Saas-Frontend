import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

export const HeroBanner = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [currentIndex, setCurrentIndex] = useState(0);

    const texts = [
        "Sell and make money",
        "First withdrawal",
        "First delivery",
        "24/7 team support",
        "Reach more customers",
        "Boost your sales",
        "Secure payments",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-between bg-[#ECEEF1] py-3 px-4 w-full md:px-8">
            {/* Left Section with Scrolling Text */}
            <div className="flex items-center cursor-pointer hover:underline hover:decoration-secondary-text-color relative h-10 overflow-hidden justify-center">
                <Icon icon="material-symbols:stars-rounded" color="#4222C4" height="20" className="mr-2" />

                <div className="relative w-64 h-10 flex items-center justify-center text-sm md:text-base text-secondary-text-color overflow-hidden">
                    <div
                        className="absolute w-full flex flex-col items-center transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateY(-${currentIndex * 40}px)` }} // Adjusted height
                    >
                        {texts.map((text, index) => (
                            <span key={index} className="h-10 flex items-center text-[#593DCA] justify-center">
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>


            {/* Center Logo */}
            <a href="/"><img className="w-28 h-10 sm:w-32 sm:h-12 m-0" src={logo} alt="cebelu logo" /></a>
            
            {/* Right Section (Language Selection) */}
            <div className="hidden sm:flex items-center justify-end w-[20%]">
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-[#F1F1F2] text-sm md:text-base text-[#4222C4] py-1 px-3 rounded-md focus:outline-none cursor-pointer"
                >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                </select>
            </div>

        </div>
    );
};
