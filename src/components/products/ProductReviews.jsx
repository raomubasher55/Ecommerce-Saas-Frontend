import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductReviews } from "../../store/actions/reviewActions";

export default function ProductReviews({ product }) {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);

  const productId = product?._id;

  useEffect(() => {
    if (productId) {
      dispatch(getProductReviews(productId));
    }
  }, [dispatch, productId]);

  return (
    <div
      className="mt-10 p-4 bg-white rounded shadow-lg w-full mx-auto"
      style={{ boxShadow: "1px 1px 20px 1px lightgray" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Reviews</h2>

      {loading && <p className="text-gray-500 text-center">Loading reviews...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {reviews.length > 0 ? (
        <div className="space-y-4 overflow-y-auto max-h-64 scrollbar-none">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <div className="flex items-center mb-2">
                {/* User Avatar */}
                  <img
                  src={review.user?.avatar?.url ? `${import.meta.env.VITE_APP_API_URL}${review.user.avatar.url}` : "/default-avatar.png"}
                  alt={review.user?.name || "User"}
                  className="w-10 h-10 rounded-full border border-gray-300 mt-0 mr-3"
                />
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{review.user?.name || "Anonymous"}</h3>
                  {/* Star Rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xl ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Comment Section */}
              <p className="text-gray-600 break-words">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No reviews for this product.</p>
      )}
    </div>
  );
}
