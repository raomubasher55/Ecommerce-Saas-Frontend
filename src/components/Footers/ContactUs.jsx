import React, { useState } from "react";
import { HeroBanner } from "../homepage/HeroBanner";
import Navbar from "../homepage/Navbar";
import { FooterPrime } from "../presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../presentation/AllAbouJumiaFooter";
import contactImg from "../../assets/contact.jpg";
import supportImg from "../../assets/support.jpg";
import { toast } from "react-toastify";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        toast.success("Message sent successfully! We'll get back to you soon.");
        e.target.reset(); // Clear form
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please check your connection.");
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
          <h1 className="text-white text-5xl font-bold">Contact Us</h1>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img src={supportImg} alt="Customer Support" className="w-full rounded-lg shadow-xl" />
          <div>
            <h2 className="text-4xl font-bold text-[#4222CF] mb-4">24/7 Customer Support</h2>
            <p className="text-lg mb-6">Our dedicated team is always here to assist you with any queries regarding orders, deliveries, and returns.</p>
            <a href="#" className="bg-[#4222CF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#3720A4] transition">Get Help Now</a>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#4222CF] mb-6">Our Contact Details</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "📍 Our Address", detail: "123 E-Commerce St, Lahore, Pakistan" },
              { title: "📞 Call Us", detail: "+92 300 1234567" },
              { title: "📧 Email", detail: "support@jumia-ecom.com" },
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
          <h2 className="text-4xl font-bold text-[#4222CF] mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
            <input type="text" name="name" placeholder="Your Name" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]" />
            <input type="email" name="email" placeholder="Your Email" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]" />
            <textarea name="message" rows="5" placeholder="Your Message" required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#4222CF]"></textarea>
            <button
              type="submit"
              className={`w-full bg-[#4222CF] text-white px-6 py-3 rounded-lg transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3720A4]"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
}
