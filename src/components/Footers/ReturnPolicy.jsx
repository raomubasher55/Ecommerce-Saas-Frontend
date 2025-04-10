import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import returnImage from "../../assets/support.jpg";
import refundImage from "../../assets/refund2.png";
import customerSupportImage from "../../assets/support.jpg";

export default function ReturnPolicy() {
    return (
        <div className="bg-gray-100 flex flex-col items-center">
            <HeroBanner />
            <Navbar />

            <div className="max-w-6xl mt-10 p-6 bg-white shadow-lg rounded-lg w-full md:px-12">
                <h2 className="text-3xl font-bold text-[#4222C4] mb-6 text-center">
                    Hassle-Free Returns & Refunds
                </h2>
                <p className="text-gray-700 text-lg text-center mb-8">
                    We value your satisfaction! If you're not happy with your order, our easy return policy ensures a smooth process.
                    Shop with confidence, knowing that we’ve got you covered.
                </p>

                {/* Return Eligibility Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <img src={returnImage} alt="Return Policy" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">Return Eligibility</h3>
                        <ul className="list-disc list-inside text-gray-700">
                            <li>Return within <strong>7 days</strong> of delivery.</li>
                            <li>Items must be unused, undamaged, and in original packaging.</li>
                            <li>Proof of purchase is required.</li>
                            <li>Returns may be subject to inspection and approval.</li>
                        </ul>
                    </div>
                </div>

                {/* Refund Process Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">Refund Process</h3>
                        <p className="text-gray-700">
                            Once we receive and inspect your return, your refund will be processed within <strong>7-10 business days</strong>.
                            The refund will be credited to your original payment method. Please note that processing times may vary
                            depending on your bank or payment provider.
                        </p>
                        <p className="text-gray-700 mt-4">
                            In case of delays, feel free to contact our support team for assistance.
                        </p>
                    </div>
                    <img src={refundImage} alt="Refund Process" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                </div>

                {/* Non-Returnable Items */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-12">
                    <h3 className="text-xl font-semibold text-[#4222C4] mb-4">Non-Returnable Items</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>Personalized or custom-made items</li>
                        <li>Gift cards</li>
                        <li>Health & hygiene products (e.g., face masks, undergarments)</li>
                        <li>Items marked as final sale or clearance</li>
                    </ul>
                </div>

                {/* Customer Support Section */}
                <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
                    <img src={customerSupportImage} alt="Customer Support" className="w-full h-44 sm:h-auto rounded-lg shadow-md" />
                    <div>
                        <h3 className="text-xl font-semibold text-[#4222C4] mb-4">Need Help?</h3>
                        <p className="text-gray-700">
                            For any return-related inquiries, contact our support team at
                            <a href="mailto:support@example.com" className="text-[#4222C4] hover:underline"> cebleu@contact.com</a>.
                        </p>
                        <p className="text-gray-700 mt-4">
                            Our customer service team is available <strong>Monday to Sunday, 9 AM - 6 PM</strong>. 
                            We strive to respond within <strong>24 hours</strong>.
                        </p>
                    </div>
                </div>
            </div>

            <FooterPrime />
            <AllAbouJumiaFooter />
        </div>
    );
}
