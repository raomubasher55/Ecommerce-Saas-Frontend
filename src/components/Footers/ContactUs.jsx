import React, { useState, useEffect } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import contactImg from "../../assets/contact.jpg";
import supportImg from "../../assets/support.jpg";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/LanguageContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedLanguage, translateText } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    contactUs: "Contact Us",
    customerSupport: "24/7 Customer Support",
    supportText: "Our dedicated team is always here to assist you with any queries regarding orders, deliveries, and returns.",
    getHelp: "Get Help Now",
    contactDetails: "Our Contact Details",
    sendMessage: "Send Us a Message",
    namePlaceholder: "Your Name",
    emailPlaceholder: "Your Email",
    messagePlaceholder: "Your Message",
    sendButton: "Send Message",
    sending: "Sending...",
    successMessage: "Message sent successfully! We'll get back to you soon.",
    errorMessage: "Failed to send message. Please try again.",
    connectionError: "An error occurred. Please check your connection.",
    addressTitle: "📍 Our Address",
    address: "123 E-Commerce St, Lahore, Pakistan",
    phoneTitle: "📞 Call Us",
    phone: "+92 300 1234567",
    emailTitle: "📧 Email",
    email: "support@jumia-ecom.com"
  });

  // New state variables for contact information
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP}/api/v1/info`);
        if (response.data.info) {
          const { address, phone, email } = response.data.info; 
          setContactInfo({ address, phone, email });
        }
      } catch (error) {
        console.error("Error fetching contact information:", error);
      }
    };

    fetchContactInfo();
  }, []);

  useEffect(() => {
    const translateAll = async () => {
      const translations = await Promise.all([
        translateText("Contact Us"),
        translateText("24/7 Customer Support"),
        translateText("Our dedicated team is always here to assist you with any queries regarding orders, deliveries, and returns."),
        translateText("Get Help Now"),
        translateText("Our Contact Details"),
        translateText("Send Us a Message"),
        translateText("Your Name"),
        translateText("Your Email"),
        translateText("Your Message"),
        translateText("Send Message"),
        translateText("Sending..."),
        translateText("Message sent successfully! We'll get back to you soon."),
        translateText("Failed to send message. Please try again."),
        translateText("An error occurred. Please check your connection."),
        translateText("📍 Our Address"),
        translateText("123 E-Commerce St, Lahore, Pakistan"),
        translateText("📞 Call Us"),
        translateText("+92 300 1234567"),
        translateText("📧 Email"),
        translateText("support@jumia-ecom.com")
      ]);

      setTranslatedContent({
        contactUs: translations[0],
        customerSupport: translations[1],
        supportText: translations[2],
        getHelp: translations[3],
        contactDetails: translations[4],
        sendMessage: translations[5],
        namePlaceholder: translations[6],
        emailPlaceholder: translations[7],
        messagePlaceholder: translations[8],
        sendButton: translations[9],
        sending: translations[10],
        successMessage: translations[11],
        errorMessage: translations[12],
        connectionError: translations[13],
        addressTitle: translations[14],
        address: translations[15],
        phoneTitle: translations[16],
        phone: translations[17],
        emailTitle: translations[18],
        email: translations[19]
      });
    };

    translateAll();
  }, [selectedLanguage, translateText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(translatedContent.successMessage);
        e.target.reset();
      } else {
        toast.error(translatedContent.errorMessage);
      }
    } catch (error) {
      toast.error(translatedContent.connectionError);
      console.error("Error submitting message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      <HeroBanner />
      <Navbar />

      {/* Contact Us Section with Image */}
      <section className="relative w-full h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${contactImg})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold">{translatedContent.contactUs}</h1>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img src={supportImg} alt="Customer Support" className="w-full rounded-lg shadow-xl" />
          <div>
            <h2 className="text-4xl font-bold text-[#4222CF] mb-4">{translatedContent.customerSupport}</h2>
            <p className="text-lg mb-6">{translatedContent.supportText}</p>
            <Link to={'/help-center'} className="bg-[#4222CF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#3720A4] transition">
              {translatedContent.getHelp}
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#4222CF] mb-6">{translatedContent.contactDetails}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: translatedContent.addressTitle, detail: contactInfo.address },
              { title: translatedContent.phoneTitle, detail: contactInfo.phone },
              { title: translatedContent.emailTitle, detail: contactInfo.email },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white border border-[#4222cf50] rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#4222CF] mb-6">{translatedContent.sendMessage}</h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
            <input 
              type="text" 
              name="name" 
              placeholder={translatedContent.namePlaceholder} 
              required 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]" 
            />
            <input 
              type="email" 
              name="email" 
              placeholder={translatedContent.emailPlaceholder} 
              required 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]" 
            />
            <textarea 
              name="message" 
              rows="5" 
              placeholder={translatedContent.messagePlaceholder} 
              required 
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]"
            ></textarea>
            <button
              type="submit"
              className={`w-full bg-[#4222CF] text-white px-6 py-3 rounded-lg transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3720A4]"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? translatedContent.sending : translatedContent.sendButton}
            </button>
          </form>
        </div>
      </section>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}