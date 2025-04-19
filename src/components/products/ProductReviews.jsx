import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductReviews } from "../../store/actions/reviewActions";
import AddReviews from "./AddReviews";
import { useLanguage } from "../../context/LanguageContext";

export default function ProductReviews({ product }) {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const [fetchComment, setFetchComment] = useState(false);
  const { selectedLanguage, translateText } = useLanguage();
  
  const [translatedContent, setTranslatedContent] = useState({
    title: "Product Reviews",
    noReviews: "No reviews for this product.",
    anonymous: "Anonymous",
    loading: "Loading reviews...",
    error: "Error loading reviews"
  });

  const [translatedComments, setTranslatedComments] = useState([]);

  // Translate static content
  useEffect(() => {
    const translateStaticContent = async () => {
      const translations = await Promise.all([
        translateText("Product Reviews"),
        translateText("No reviews for this product."),
        translateText("Anonymous"),
        translateText("Loading reviews..."),
        translateText("Error loading reviews")
      ]);
      
      setTranslatedContent({
        title: translations[0],
        noReviews: translations[1],
        anonymous: translations[2],
        loading: translations[3],
        error: translations[4]
      });
    };
    
    translateStaticContent();
  }, [selectedLanguage, translateText]);

  // Translate comments
  useEffect(() => {
    const translateDynamicContent = async () => {
      const translated = await Promise.all(
        reviews.map(review => 
          review.comment ? translateText(review.comment) : Promise.resolve("")
        )
      );
      setTranslatedComments(translated);
    };
    
    if (reviews.length > 0) {
      translateDynamicContent();
    }
  }, [reviews, selectedLanguage, translateText]);

  const productId = product?._id;

  useEffect(() => {
    if (productId && fetchComment) {
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, productId, fetchComment]);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10 p-4 bg-white rounded shadow-lg w-full mx-auto">
        <p className="text-gray-500">{translatedContent.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-10 p-4 bg-white rounded shadow-lg w-full mx-auto">
        <p className="text-red-500">{translatedContent.error}</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center mt-10 p-4 bg-white rounded shadow-lg w-full mx-auto relative"
      style={{ boxShadow: "1px 1px 20px 1px lightgray" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center sm:text-start w-full">
        {translatedContent.title}
      </h2>
      <div className="sm:absolute right-4 top-5">
        <AddReviews product={product} setFetchComment={setFetchComment} />
      </div>

      {reviews.length > 0 ? (
        <div className="w-full space-y-4 overflow-y-auto max-h-64 scrollbar-none">
          {reviews.map((review, index) => (
            <div key={review._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center mb-2">
                {/* User Avatar */}
                <img
                  src={
                    review.user?.avatar?.url
                      ? `${import.meta.env.VITE_APP_API_URL}${review.user.avatar.url}`
                      : "/default-avatar.png"
                  }
                  alt={review.user?.name || translatedContent.anonymous}
                  className="w-10 h-10 rounded-full border border-gray-300 mt-0 mr-3"
                />

                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {review.user?.name || translatedContent.anonymous}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Comment Section */}
              <p className="text-gray-600 break-words">
                {translatedComments[index] || review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">{translatedContent.noReviews}</p>
      )}
    </div>
  );
}