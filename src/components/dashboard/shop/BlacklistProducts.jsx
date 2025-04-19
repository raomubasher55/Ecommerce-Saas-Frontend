import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlackistProductsByStore } from "../../../store/actions/storeActions";
import Loader from "../../../utils/Loader";

const BlacklistProducts = () => {
    const dispatch = useDispatch();
    const { blacklistProducts, loading, error } = useSelector((state) => state.blacklistProducts);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Maximum 10 products per page

    useEffect(() => {
        dispatch(fetchBlackistProductsByStore());
    }, [dispatch]);

    if (loading) return <div className="text-center mt-5"><Loader /> </div>;
    if (error) return <div className="text-center mt-5 text-red-500">Error: {error}</div>;

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = blacklistProducts.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(blacklistProducts.length / itemsPerPage);

    return (
        <div className="w-[260px] sm:w-full overflow-scroll">
            <div className="w-full p-5 ">
            <h1 className="text-xl font-semibold mb-4">Blacklist Products</h1>

            {blacklistProducts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Id</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Stock</th>
                                <th className="border border-gray-300 px-4 py-2">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((product) => (
                                <tr key={product._id} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product._id}</td>
                                    <td className="border border-gray-300 px-4 py-2">A.D {product.price}</td>
                                    <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                    <img src={`${import.meta.env.VITE_APP}/${product.images[0]?.url}`} alt={product.name} className="h-12 w-12 object-cover mx-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center mt-4 text-gray-600">No blacklist products found.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-5 space-x-2">
                    <button
                        className="px-3 py-1 border rounded-md"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                        if (index + 1 === currentPage || index + 1 === 1 || index + 1 === totalPages) {
                            return (
                                <button
                                    key={index}
                                    className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? "bg-gray-400 text-white" : "bg-white"}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            );
                        } else if (index + 1 === currentPage + 1 || index + 1 === currentPage - 1) {
                            return (
                                <button
                                    key={index}
                                    className="px-3 py-1 border rounded-md"
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            );
                        } else if (index + 1 === 2 || index + 1 === totalPages - 1) {
                            return <span key={index}>...</span>;
                        } else {
                            return null;
                        }
                    })}

                    <button
                        className="px-3 py-1 border rounded-md"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default BlacklistProducts;
