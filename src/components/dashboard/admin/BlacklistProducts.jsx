import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlacklistProducts, removeFromBlacklist } from "../../../store/actions/blacklistActions";

export default function BlacklistProducts() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.blacklist);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        dispatch(fetchBlacklistProducts());
    }, [dispatch]);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.seller.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, products]);

    const handleRemoveClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const confirmRemove = () => {
        if (selectedProduct) {
            dispatch(removeFromBlacklist(selectedProduct.seller, selectedProduct._id));
            setModalOpen(false);
        }
    };

    return (
        <div className="w-[270px] sm:w-auto overflow-hidden">
            <div className="max-w-5xl mx-auto mt-6 overflow-hidden bg-white text-gray-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Blacklisted Products</h2>
                
                <input
                    type="text"
                    placeholder="Search by Name, ID, or Seller ID"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {filteredProducts.length === 0 && !loading && !error && (
                    <p className="text-gray-600">No blacklisted products found.</p>
                )}
                
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="py-2 px-4 border">#</th>
                                    <th className="py-2 px-4 border">Product Name</th>
                                    <th className="py-2 px-4 border">Product Image</th>
                                    <th className="py-2 px-4 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{index + 1}</td>
                                        <td className="py-2 px-4 border">{product.name}</td>
                                        <td className="py-2 px-4 border">
                                            {product.images?.length > 0 ? (
                                                <img
                                                    src={`${import.meta.env.VITE_APP}/${product.images[0].url}`}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            ) : (
                                                <span className="text-gray-500">No Image</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border">
                                            <button
                                                onClick={() => handleRemoveClick(product)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {modalOpen && selectedProduct && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <p className="text-lg font-medium">
                                Are you sure you want to remove <strong>{selectedProduct.name}</strong> from the blacklist?
                            </p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRemove}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                >
                                    Yes, Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
