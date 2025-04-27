import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateReview } from '../../../store/actions/reviewActions';

export default function FeedbackModal({ closeModal, selectedOrder }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.review);
  const productId = selectedOrder?.orderItems[0]?.product?._id || null;

  const [review, setReview] = useState({ rating: 5, comment: '' });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!productId) return; // Ensure productId exists before dispatching

    dispatch(addOrUpdateReview(productId, review));
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Leave Feedback</h2>
        <p className="text-gray-600 mb-4">
          How was your experience with {selectedOrder?.orderItems[0]?.name}?
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleReviewSubmit}>
          <label className="block mb-2">Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            className="border p-2 w-full rounded"
          />

          <label className="block mt-4 mb-2">Comment:</label>
          <textarea
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            className="border p-2 w-full rounded"
            rows="3"
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
