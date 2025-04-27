import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadDocument } from "../store/actions/storeActions";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaCalendarAlt, FaUser } from "react-icons/fa";
import UserContext from "../components/context/UserContext";
import { FooterPrime } from "../components/presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import Navbar from "../components/homepage/Navbar";
import { HeroBanner } from "../components/homepage/HeroBanner";
import docImage from "../assets/verification.jpg";
import { toast } from "react-toastify";
import { useLanguage } from "../context/LanguageContext";

const UploadDocuments = () => {
  const [documentType, setDocumentType] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    cnic: "",
    DOB: "",
    dateofissue: "",
    dateofexpiry: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setRefreshData } = useContext(UserContext);
  const { selectedLanguage, translateText } = useLanguage();

  const uploadDocumentStatus = useSelector((state) => state.uploadDocumentStatus);
  const { loading, success, error } = uploadDocumentStatus;

  const [translatedContent, setTranslatedContent] = useState({
    welcomeTitle: "Verify Your Identity",
    welcomeSubtitle: "Let’s verify your identity. Fill in your personal information exactly as it appears on your uploaded document. Only after a match will your data be verified.",
    importantNote: "Important Notes",
    firstLine: "The document must be clear, in color, and without reflections.",
    secondLine: "The document must be valid.",
    thirdLine: "Your ID name must match your account name.",
    uploadId: "Upload Your ID",
    documentTypeDropdown: "Select Document Type",
    idCard: "ID Card",
    passportDrop: "Passport",
    drivingLicnence: "Driving License",
    residentPerment: "Resident Permet",
    passwordStrength: "Password Strength",
    uploadFront: "Upload Frontend",
    uploadBackend: "Upload Backend",
    submit: "Submit",
  });

  useEffect(() => {
    const translateContent = async () => {
      const translations = await Promise.all([
        translateText("Verify Your Identity"),
        translateText("Let’s verify your identity. Fill in your personal information exactly as it appears on your uploaded document. Only after a match will your data be verified."),
        translateText("Important Notes"),
        translateText("The document must be clear, in color, and without reflections."),
        translateText("The document must be valid."),
        translateText("Your ID name must match your account name."),
        translateText("Upload Your ID"),
        translateText("Select Document Type"),
        translateText("ID Card"),
        translateText("Passport"),
        translateText("Driving License"),
        translateText("Resident Permet"),
        translateText("Password Strength"),
        translateText("Upload Frontend"),
        translateText("Upload Backend"),
        translateText("Submit"),
      ]);

      setTranslatedContent({
        welcomeTitle: translations[0],
        welcomeSubtitle: translations[1],
        importantNote: translations[2],
        firstLine: translations[3],
        secondLine: translations[4],
        thirdLine: translations[5],
        addressPlaceholder: translations[6],
        uploadId: translations[7],
        documentTypeDropdown: translations[8],
        idCard: translations[9],
        passportDrop: translations[10],
        drivingLicnence: translations[11],
        residentPerment: translations[12],
        passwordStrength: translations[13],
        uploadFront: translations[14],
        uploadBackend: translations[15],
        submit: translations[16],
      });
    };

    translateContent();
  }, [selectedLanguage, translateText]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages((prevImages) => [
      ...prevImages,
      ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))
    ]);
  };

  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);


  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!documentType || uploadedImages.length === 0) {
      alert("Please select a document type and upload images.");
      return;
    }
    setShowModal(true); // Show modal after uploading
  };

  const handleChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (Object.values(personalInfo).some((value) => value === "")) {
      toast.error("Please fill in all personal information fields.");
      return;
    }

    const formData = new FormData();
    uploadedImages.forEach((image) => {
      formData.append("documents", image.file);
    });

    formData.append("documentType", documentType);
    formData.append("personalInfo", JSON.stringify(personalInfo));

    try {
      await dispatch(uploadDocument(formData));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };


  useEffect(() => {
    if (success) {
      setRefreshData(true);
      setShowModal(false);
      navigate("/upload-documents/choose-plans");
    }

    if (error) {
      toast.error(error);
    }
  }, [success, error, setRefreshData, navigate]);

  const getUploadText = () => {
    if (uploadedImages.length === 0) return "Upload Front Side";
    if (uploadedImages.length === 1) return "Upload Back Side";
    return "Upload Back Side";
  };

  return (
    <>
      <HeroBanner />
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#4222C4] text-center">{translatedContent.welcomeTitle}</h2>
        <p className="mt-2 text-gray-500 text-center">
        {translatedContent.welcomeSubtitle}
        </p>

        <div className="flex flex-col items-center mt-8 gap-6">
          <div className="w-full flex flex-col items-center sm:flex-row gap-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="mt-6 space-y-4 w-full sm:w-1/2">
            <h3 className="text-xl font-semibold text-[#4222C4]">{translatedContent.importantNote}</h3>
              <div className="flex items-center gap-3">
                <FaCamera className="text-[#4222C4]" />
                <p>{translatedContent.firstLine}</p>
              </div>
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#4222C4]" />
                <p>{translatedContent.secondLine}</p>
              </div>
              <div className="flex items-center gap-3">
                <FaUser className="text-[#4222C4]" />
                <p>{translatedContent.thirdLine}</p>
              </div>
            </div>
            <img src={docImage} alt="Verification" className="mt-6 w-max sm:w-[350px] h-[300px] sm:h-[450px] rounded-lg shadow-md" />
          </div>

          <div className="w-full md:w-2/3 p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-[#4222C4]">{translatedContent.uploadId}</h3>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-[#4222C4]"
            >
              <option value="">Select Documents Types</option>
              <option value="id-card">ID Card</option>
              <option value="passport">{translatedContent.passportDrop}</option>
              <option value="driving-license">{translatedContent.drivingLicnence}</option>
              <option value="resident">{translatedContent.residentPerment}</option>
            </select>

            <div className="border border-gray-300 rounded-lg p-6 mt-4 text-center">
              <input disabled={uploadedImages.length === 2} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer bg-[#4222C4] text-white px-6 py-2 rounded-lg hover:bg-[#31189B] transition">
                {getUploadText()}
              </label>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img src={file.preview} alt={`Upload Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-sm" />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <button onClick={handleUpload} className="mt-6 w-full bg-[#4222C4] text-white px-4 py-2 rounded-lg hover:bg-[#31189B] transition">
                {/* {translatedContent.submit} */}
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold text-[#4222C4] mb-4">Fill Personal Information</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label className="block text-gray-600">NAME</label>
                <input
                  type="text"
                  name="firstName"
                  value={personalInfo.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Father Name Field */}
              <div>
                <label className="block text-gray-600">LAST NAME</label>
                <input
                  type="text"
                  name="lastName"
                  value={personalInfo.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Gender Dropdown */}
              <div>
                <label className="block text-gray-600">GENDER</label>
                <select
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* CNIC Field */}
              <div>
                <label className="block text-gray-600">CNIC</label>
                <input
                  type="number"
                  name="cnic"
                  value={personalInfo.cnic}
                  onChange={handleChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* DOB Field */}
              <div className='w-full'>
                <label className="block text-gray-600 w-full">DATE OF BIRTH</label>
                <input
                  type="date"
                  name="DOB"
                  value={personalInfo.DOB}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <br />

              {/* ID Card Issue Date */}
              <div>
                <label className="block text-gray-600">DATE OF ISSUE</label>
                <input
                  type="date"
                  name="dateofissue"
                  value={personalInfo.dateofissue}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* ID Card Expiry Date */}
              <div>
                <label className="block text-gray-600">DATE OF EXPIRY</label>
                <input
                  type="date"
                  name="dateofexpiry"
                  value={personalInfo.dateofexpiry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className={`mt-4 w-full bg-[#4222C4] text-white p-2 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      )}


      <FooterPrime />
      <AllAbouJumiaFooter />
    </>
  );
};

export default UploadDocuments;
