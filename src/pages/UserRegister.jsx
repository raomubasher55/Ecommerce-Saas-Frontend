import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/actions/userActions";
import { toast } from "react-toastify";
import { FooterPrime } from "../components/presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import { HeroBanner } from "../components/homepage/HeroBanner";
import Navbar from "../components/homepage/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import EmailVerifyModal from '../components/presentation/modals/emailVerifyModal'
import { useLanguage } from "../context/LanguageContext";

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  console.log(error)
  const { selectedLanguage, translateText } = useLanguage();
  const [captchaToken, setCaptchaToken] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [translatedContent, setTranslatedContent] = useState({
    welcomeTitle: "Welcome to Our E-commerce Platform",
    welcomeSubtitle: "Buy your favorite products, enjoy exclusive discounts, and get free home delivery. Register now and start shopping with ease!",
    firstNamePlaceholder: "First Name",
    surnamePlaceholder: "Surname",
    emailPlaceholder: "Email",
    mobilePlaceholder: "Mobile",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm Password",
    passwordStrength: "Password Strength:",
    weakPassword: "Weak",
    mediumPassword: "Medium",
    strongPassword: "Strong",
    registerButton: "Register",
    registeringButton: "Registering...",
    fillFieldsError: "Please fill all the fields and upload an image",
    passwordMatchError: "Passwords do not match",
    captchaError: "Please verify you are human"
  });


  useEffect(() => {
    const translateContent = async () => {
      const translations = await Promise.all([
        translateText("Welcome to Our E-commerce Platform"),
        translateText("Buy your favorite products, enjoy exclusive discounts, and get free home delivery. Register now and start shopping with ease!"),
        translateText("First Name"),
        translateText("Surname"),
        translateText("Email"),
        translateText("Mobile"),
        translateText("Password"),
        translateText("Confirm Password"),
        translateText("Password Strength:"),
        translateText("Weak"),
        translateText("Medium"),
        translateText("Strong"),
        translateText("Register"),
        translateText("Registering..."),
        translateText("Please fill all the fields and upload an image"),
        translateText("Passwords do not match"),
        translateText("Please verify you are human")
      ]);
      setTranslatedContent({
        welcomeTitle: translations[0],
        welcomeSubtitle: translations[1],
        firstNamePlaceholder: translations[2],
        surnamePlaceholder: translations[3],
        emailPlaceholder: translations[4],
        mobilePlaceholder: translations[5],
        passwordPlaceholder: translations[6],
        confirmPasswordPlaceholder: translations[7],
        passwordStrength: translations[8],
        weakPassword: translations[9],
        mediumPassword: translations[10],
        strongPassword: translations[11],
        registerButton: translations[12],
        registeringButton: translations[13],
        fillFieldsError: translations[14],
        passwordMatchError: translations[15],
        captchaError: translations[16]
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };
  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (
      password.match(/[0-9]/) &&
      password.match(/[A-Z]/) &&
      password.match(/[!@#$%^&*]/)
    ) {
      setPasswordStrength("Strong");
    } else if (
      (password.match(/[0-9]/) && password.match(/[A-Z]/)) ||
      (password.match(/[0-9]/) && password.match(/[!@#$%^&*]/)) ||
      (password.match(/[A-Z]/) && password.match(/[!@#$%^&*]/))
    ) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      toast.error("Please verify you are human");
      return;
    }



    if (!formData.firstName || !formData.surname || !formData.email || !formData.mobile || !formData.password || !image) {
      toast.error("Please fill all the fields and upload an image");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isCaptchaVerified) {
      toast.error("Please verify you are human");
      return;
    }
    const fullName = `${formData.firstName} ${formData.surname}`.trim();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", fullName);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("mobile", formData.mobile);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("photo", image);
    formDataToSubmit.append("captchaToken", captchaToken);


    dispatch(registerUser(formDataToSubmit));
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timer);

  };


  const handleReturnHome = () => {
    localStorage.removeItem("token");
    setShowModal(false);
    navigate("/");
  };

  console.log(import.meta.env.RECAPTCHA_KEY)

  return (
    <div>
      <HeroBanner />
      <Navbar />
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full md:w-[70%] space-y-8">
          <h2 className="text-center text-4xl font-extrabold text-[#4222C4]">
            {translatedContent.welcomeTitle}
          </h2>
          <p className="text-center text-lg text-[#5E3BE1]">
            {translatedContent.welcomeSubtitle}
          </p>
          {error && <div className="mt-4 text-center text-red-500">{error}</div>}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 rounded-lg shadow-md p-6 bg-white"
          >
            {/* Name and Surname Fields in One Line */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder={translatedContent.firstNamePlaceholder}
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
                required
              />

              <input
                type="text"
                name="surname"
                placeholder={translatedContent.surnamePlaceholder}
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder={translatedContent.emailPlaceholder}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder={translatedContent.mobilePlaceholder}
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
              required
            />

            {/* Password Field */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={translatedContent.passwordPlaceholder}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
                required
                minLength="6"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={translatedContent.confirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
                required
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Password Strength Indicator */}
            <p
              className={`mt-1 text-sm font-medium ${passwordStrength === translatedContent.weakPassword ? "text-red-500" :
                passwordStrength === translatedContent.mediumPassword ? "text-yellow-500" :
                  passwordStrength === translatedContent.strongPassword ? "text-green-500" : "text-gray-500"
                }`}
            >
              {passwordStrength && `Password Strength: ${passwordStrength}`}
            </p>

            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
            />

            {/* CAPTCHA Verification */}
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
              onChange={(token) => {
                setIsCaptchaVerified(true);
                setCaptchaToken(token);
              }}
              onExpired={() => {
                setIsCaptchaVerified(false);
                setCaptchaToken(null);
              }}
            />




            <button
              type="submit"
              className="w-full cursor-pointer bg-[#4222C4] hover:bg-[#5E3BE1] text-white py-2 rounded-md focus:outline-none focus:ring focus:ring-[#5E3BE1]"
              disabled={!isCaptchaVerified}
            >
              {loading ? translatedContent.registeringButton : translatedContent.registerButton}
            </button>
          </form>
        </div>
      </div>

      {!error && showModal && (
        <EmailVerifyModal handleReturnHome={handleReturnHome} />
      )}




      <FooterPrime />
      <AllAbouJumiaFooter />
    </div>
  );
};

export default UserRegister;
