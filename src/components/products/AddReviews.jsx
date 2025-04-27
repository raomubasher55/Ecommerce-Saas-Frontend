import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateReview } from "../../store/actions/reviewActions";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";
import { useLanguage } from "../../context/LanguageContext";

export default function AddReviews({ product, setFetchComment }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.review);
  const { selectedLanguage, translateText } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");

  const [translatedContent, setTranslatedContent] = useState({
    addReview: "Add Review",
    modalTitle: "Add Review",
    ratingLabel: "Rating:",
    commentLabel: "Comment:",
    commentPlaceholder: "Write your review...",
    cancelButton: "Cancel",
    submitButton: "Submit",
    submitting: "Submitting...",
    errorMessage: "An error occurred"
  });

  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("Add Review"),
        translateText("Add Review"), // Modal title can be same
        translateText("Rating:"),
        translateText("Comment:"),
        translateText("Write your review..."),
        translateText("Cancel"),
        translateText("Submit"),
        translateText("Submitting..."),
        translateText("An error occurred")
      ]);
      
      setTranslatedContent({
        addReview: translations[0],
        modalTitle: translations[1],
        ratingLabel: translations[2],
        commentLabel: translations[3],
        commentPlaceholder: translations[4],
        cancelButton: translations[5],
        submitButton: translations[6],
        submitting: translations[7],
        errorMessage: translations[8]
      });
    };
    
    translateStaticContent();
  }, [selectedLanguage, translateText]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!product) return;

    const review = { rating, comment };
    dispatch(addOrUpdateReview(product._id, review));
    setIsModalOpen(false);
    setFetchComment(true);
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <BiSolidEdit className="text-lg" />
        {translatedContent.addReview}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              <IoMdClose className="text-2xl" />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {translatedContent.modalTitle}
            </h2>

            {error && <p className="text-red-500 mb-2">{translatedContent.errorMessage}</p>}

            <form onSubmit={handleReviewSubmit}>
              {/* Star Rating */}
              <label className="block text-gray-700 font-medium">
                {translatedContent.ratingLabel}
              </label>
              <div className="flex gap-1 my-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`text-2xl cursor-pointer transition ${
                      (hoverRating || rating) >= num ? "text-yellow-500 scale-110" : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(num)}
                    aria-label={`Rate ${num} stars`}
                  >
                    {num <= (hoverRating || rating) ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>

              {/* Comment Box */}
              <label className="block mt-4 text-gray-700 font-medium">
                {translatedContent.commentLabel}
              </label>
              <textarea
                className="w-full p-3 border rounded-lg mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={translatedContent.commentPlaceholder}
                aria-label="Review comment"
              ></textarea>

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition"
                  onClick={() => setIsModalOpen(false)}
                >
                  {translatedContent.cancelButton}
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-md ml-3 shadow-md hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? translatedContent.submitting : translatedContent.submitButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}