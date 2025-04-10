import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { verifyUser, verifyEmail } from "../store/actions/VerifyActions";
import EmailVerifyModal from "../components/presentation/modals/emailVerifyModal";
import companyLogo from "../assets/logo.png"; // Ensure correct path

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.verify);
  const { loading: emailLoading, message, error: emailError } = useSelector((state) => state.emailVerification);

  const [showResendSection, setShowResendSection] = useState(false);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(verifyUser(token));
    }
  }, [dispatch, token]);

  const handleResendEmail = () => {
    dispatch(verifyEmail(email));
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Company Logo */}
      <img src={companyLogo} alt="Company Logo" className="w-32 h-16 mb-4" />

      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!showResendSection ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Verify Your Email</h2>
            <p className="text-center text-gray-600">Verifying your email...</p>
            {loading && <p className="text-blue-500 text-center mt-2">Verifying...</p>}
            {success && <p className="text-green-500 text-center mt-2">Email verified successfully!</p>}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            {/* Resend Token Link */}
            <p
              className="text-blue-600 text-center mt-4 cursor-pointer hover:underline"
              onClick={() => setShowResendSection(true)}
            >
              Resend Token Again on Gmail
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-center mb-4">Resend Verification Email</h2>
            <p className="text-center text-gray-600">Enter your email to receive a new verification link.</p>

            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md p-2 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleResendEmail}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
              disabled={emailLoading}
            >
              {emailLoading ? "Sending..." : "Send Verification Email"}
            </button>

            {message && <p className="text-green-600 text-center mt-2">{message}</p>}
            {emailError && <p className="text-red-600 text-center mt-2">{emailError}</p>}
          </>
        )}

        {/* Return Home Button */}
        <button
          onClick={handleReturnHome}
          className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md w-full hover:bg-gray-700"
        >
          Return Home
        </button>
      </div>

      {showModal && <EmailVerifyModal handleReturnHome={handleReturnHome} />}
    </div>
  );
};

export default VerifyEmail;
