import React, { useEffect, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { getStore } from '../../store/actions/storeActions';

export default function ProductByRange({ categories, products }) {
    // const { store } = useSelector((state) => state.store);
    // const dispatch = useDispatch();

    const [loading, setLoading] = useState(true); // Loading state

    // useEffect(() => {
    //     dispatch(getStore());
    // }, [dispatch]);

    // Jab products update ho jayein to loading false kar do
    useEffect(() => {
        if (products && products.products) {
            setLoading(false);
        }
    }, [products]);

    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedGender, setSelectedGender] = useState([]);
    const [showPromotionalItems, setShowPromotionalItems] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [selectedRating, setSelectedRating] = useState(null);

    const handleCategoryChange = (category) => {
        setSelectedCategory((prev) =>
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    return (
        <div className="w-full h-max p-4 mt-10 flex flex-wrap gap-4">
            {/* Left Sidebar */}
            <div className="w-full sm:w-1/4 lg:w-1/5 h-max bg-white border border-gray-300 rounded shadow-md p-4">
                <h1 className="text-lg font-semibold mb-2 text-[#4c28db]">Category</h1>
                <ul className="space-y-1 text-sm text-gray-700">
                    {categories?.map((category) => (
                        <li key={category._id}>
                            {/* Category Checkbox */}
                            <input
                                type="checkbox"
                                id={`category-${category._id}`}
                                checked={selectedCategory.includes(category.name)}
                                onChange={() => handleCategoryChange(category.name)}
                                className="mr-2"
                            />
                            <label htmlFor={`category-${category._id}`} className="text-sm text-gray-700">
                                {category.name}
                            </label>

                            {/* Subcategories */}
                            {category.subcategories?.length > 0 && (
                                <ul className="ml-4 space-y-1 text-sm text-gray-600">
                                    {category.subcategories.map((sub) => (
                                        <li key={sub._id}>
                                            <input
                                                type="checkbox"
                                                id={`subcategory-${sub._id}`}
                                                checked={selectedCategory.includes(sub.name)}
                                                onChange={() => handleCategoryChange(sub.name)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`subcategory-${sub._id}`} className="text-sm text-gray-600">
                                                {sub.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Product List */}
            <div className="w-full sm:w-3/4 lg:w-3/4">
                {loading ? (
                    <p className="text-center text-gray-600 text-xl">Loading products...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {products && products.products.length > 0 ? (
                            products.products.map((product) => (
                                <div key={product._id} className="border rounded-lg p-4 shadow-lg">
                                    <img
                                        src={`${import.meta.env.VITE_APP}/${product.images[0]?.url.replace(/\\/g, "/")}`}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                    <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                                    <p className="text-gray-600">
                                        {product.description?.length > 15
                                            ? product.description.substring(0, 15) + "..."
                                            : product.description}
                                    </p>

                                    <p className="text-gray-800 font-semibold mt-2">
                                        Price: ${product.discountedPrice || product.price}
                                    </p>
                                    {product.discountPercentage && (
                                        <p className="text-red-500">Discount: {product.discountPercentage}% off</p>
                                    )}
                                    <div className="flex items-center mt-2">
                                        {[...Array(5)].map((_, index) => (
                                            index < product.ratings ? <FaStar key={index} className="text-yellow-400" /> : <FaRegStar key={index} className="text-gray-400" />
                                        ))}
                                    </div>
                                    <Link to={`/single-product/${product._id}`} className="mt-4 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                                        View Details
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No products available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
