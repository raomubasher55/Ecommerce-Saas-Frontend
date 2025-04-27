import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import returnImage from "../../assets/support.jpg";
import refundImage from "../../assets/refund2.png";
import customerSupportImage from "../../assets/support.jpg";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useState } from "react";

export default function ReturnPolicy() {
    const { selectedLanguage, translateText } = useLanguage();
    const [translatedContent, setTranslatedContent] = useState({
        pageTitle: "Hassle-Free Returns & Refunds",
        pageDescription: "We value your satisfaction! If you're not happy with your order, our easy return policy ensures a smooth process. Shop with confidence, knowing that we've got you covered.",
        returnEligibility: "Return Eligibility",
        returnItems: [
            "Return within 7 days of delivery.",
            "Items must be unused, undamaged, and in original packaging.",
            "Proof of purchase is required.",
            "Returns may be subject to inspection and approval."
        ],
        refundProcess: "Refund Process",
        refundText1: "Once we receive and inspect your return, your refund will be processed within 7-10 business days. The refund will be credited to your original payment method. Please note that processing times may vary depending on your bank or payment provider.",
        refundText2: "In case of delays, feel free to contact our support team for assistance.",
        nonReturnable: "Non-Returnable Items",
        nonReturnableItems: [
            "Personalized or custom-made items",
            "Gift cards",
            "Health & hygiene products (e.g., face masks, undergarments)",
            "Items marked as final sale or clearance"
        ],
        needHelp: "Need Help?",
        helpText1: "For any return-related inquiries, contact our support team at",
        helpText2: "Our customer service team is available Monday to Sunday, 9 AM - 6 PM. We strive to respond within 24 hours.",
        contactEmail: "cebleu@contact.com"
    });

    useEffect(() => {
        const translateAll = async () => {
            const translations = await Promise.all([
                translateText("Hassle-Free Returns & Refunds"),
                translateText("We value your satisfaction! If you're not happy with your order, our easy return policy ensures a smooth process. Shop with confidence, knowing that we've got you covered."),
                translateText("Return Eligibility"),
                translateText("Return within 7 days of delivery."),
                translateText("Items must be unused, undamaged, and in original packaging."),
                translateText("Proof of purchase is required."),
                translateText("Returns may be subject to inspection and approval."),
                translateText("Refund Process"),
                translateText("Once we receive and inspect your return, your refund will be processed within 7-10 business days. The refund will be credited to your original payment method. Please note that processing times may vary depending on your bank or payment provider."),
                translateText("In case of delays, feel free to contact our support team for assistance."),
                translateText("Non-Returnable Items"),
                translateText("Personalized or custom-made items"),
                translateText("Gift cards"),
                translateText("Health & hygiene products (e.g., face masks, undergarments)"),
                translateText("Items marked as final sale or clearance"),
                translateText("Need Help?"),
                translateText("For any return-related inquiries, contact our support team at"),
                translateText("Our customer service team is available Monday to Sunday, 9 AM - 6 PM. We strive to respond within 24 hours."),
                translateText("cebleu@contact.com")
            ]);

            setTranslatedContent({
                pageTitle: translations[0],
                pageDescription: translations[1],
                returnEligibility: translations[2],
                returnItems: translations.slice(3, 7),
                refundProcess: translations[7],
                refundText1: translations[8],
                refundText2: translations[9],
                nonReturnable: translations[10],
                nonReturnableItems: translations.slice(11, 15),
                needHelp: translations[15],
                helpText1: translations[16],
                helpText2: translations[17],
                contactEmail: translations[18]
            });
        };

        translateAll();
    }, [selectedLanguage, translateText]);

    return (
        <div className="bg-gray-100 flex flex-col items-center">
            <HeroBanner />
            <Navbar />

            <div className="max-w-6xl mt-10 p-6 bg-white shadow-lg rounded-lg w-full md:px-12">
                <h2 className="text-3xl font-bold text-[#4222C4] mb-6 text-center">
                    {translatedContent.pageTitle}
                </h2>
                <p className="text-gray-700 text-lg text-center mb-8">
                    {translatedContent.pageDescription}
                </p>

                {/* Return Eligibility Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <img src={returnImage} alt="Return Policy" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{translatedContent.returnEligibility}</h3>
                        <ul className="list-disc list-inside text-gray-700">
                            {translatedContent.returnItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Refund Process Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{translatedContent.refundProcess}</h3>
                        <p className="text-gray-700">
                            {translatedContent.refundText1}
                        </p>
                        <p className="text-gray-700 mt-4">
                            {translatedContent.refundText2}
                        </p>
                    </div>
                    <img src={refundImage} alt="Refund Process" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                </div>

                {/* Non-Returnable Items */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-12">
                    <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{translatedContent.nonReturnable}</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        {translatedContent.nonReturnableItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

                {/* Customer Support Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                    <img src={customerSupportImage} alt="Customer Support" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">{translatedContent.needHelp}</h3>
                        <p className="text-gray-700">
                            {translatedContent.helpText1}
                            <a href="mailto:cebleu@contact.com" className="text-[#4222C4] hover:underline"> {translatedContent.contactEmail}</a>.
                        </p>
                        <p className="text-gray-700 mt-4">
                            {translatedContent.helpText2}
                        </p>
                    </div>
                </div>
            </div>

            <FooterPrime />
            <AllAbouJumiaFooter />
        </div>
    );
}