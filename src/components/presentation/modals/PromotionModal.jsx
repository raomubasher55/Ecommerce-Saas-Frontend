import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAd } from "../../../store/actions/adActions";

const PromotionModal = ({ productId, setIsPromotionModalOpen , store }) => {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [adData, setAdData] = useState({
        title: "",
        description: "",
        product: productId || "",
        startDate: "",
        endDate: "",
        price:0,
        store:store
    });

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleChange = (e) => {
        setAdData({ ...adData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createAd(adData, image));
        setIsPromotionModalOpen(false);
    };

    const onClose = () => {
        setIsPromotionModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
                <h2 className="text-xl font-semibold text-center mb-4">Promote Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Ad Title"
                        value={adData.title}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Ad Description"
                        value={adData.description}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="product"
                        value={adData.product}
                        readOnly
                        className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                    />
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                         className="w-full border px-3 py-2 rounded-lg bg-gray-100"
                    />

                    <div className="flex gap-2">
                        <input
                            type="date"
                            name="startDate"
                            value={adData.startDate}
                            onChange={handleChange}
                            className="w-1/2 border px-3 py-2 rounded-lg"
                            required
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={adData.endDate}
                            onChange={handleChange}
                            className="w-1/2 border px-3 py-2 rounded-lg"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                    <input
                        type="number"
                        name="price"
                        placeholder="Manual Charges"
                        value={adData.price}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                        <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg">
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                            Promote
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionModal;
