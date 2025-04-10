import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { fetchStoreProducts } from "../../store/actions/storeActions";

// Custom arrows for the slider
function CustomPrevArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer z-10 hover:bg-gray-600"
            onClick={onClick}
        >
            ◀
        </div>
    );
}

function CustomNextArrow(props) {
    const { onClick } = props;
    return (
        <div
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer z-10 hover:bg-gray-600"
            onClick={onClick}
        >
            ▶
        </div>
    );
}

export default function AllStoreProduct() {
    const dispatch = useDispatch();
    const { loading, stores, products, error } = useSelector(state => state.ProductsByReducer);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        dispatch(fetchStoreProducts());
    }, [dispatch]);

    useEffect(() => {
        if (stores.length && products.length) {
            const flattenedProducts = stores.flatMap(store =>
                products.filter(product => store.products.includes(product._id)).map(product => ({
                    ...product,
                    storeName: store.name
                }))
            );
            setAllProducts(flattenedProducts);
        }
    }, [stores, products]);


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6, // Display 6 products per slide
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5, // 5 products on large screens
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4, // 4 products on medium screens
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2, // 2 products on smaller screens
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1, // 1 product on very small screens
                },
            },
        ],
    };


    if (loading) return <div className="container bg-gray-100 relative w-full overflow-hidden mt-28 pt-14 pb-6 rounded">
        <Slider {...settings}>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-4">
                    <div className="h-80 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
            ))}
        </Slider>
    </div>;
    if (error) return <div>{' '}</div>;

    return (
        <div className="container bg-gray-100 relative w-full overflow-hidden mt-28 pt-14 pb-6 rounded">
            <h2 className="text-center text-2xl font-bold mb-6 text-[#4222C4]">
                All Store Products
            </h2>

            {
                (!allProducts || allProducts.length === 0) ? (
                    <div className="text-center text-gray-600 text-xl">
                        No products available
                    </div>
                ) : (
                    <Slider {...settings}>
                        {allProducts.map((product) => (
                            <Link
                                to={`/single-product/${product._id}`}
                                key={product._id}
                                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-4"
                            >
                                <div
                                    className="relative h-80 rounded-lg shadow-lg overflow-hidden group"
                                    style={{
                                        backgroundImage: `url(${import.meta.env.VITE_APP}/${product?.images[0]?.url?.replace(/\\/g, "/")})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-between p-4 text-white">
                                        <div>
                                            <h3 className="text-xl font-semibold">{product.name}</h3>
                                            <p className="text-sm truncate">{product.description}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="hover:underline"
                                                style={{
                                                    color: "white",
                                                    textShadow: "0 0 8px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)",
                                                }}

                                            >
                                                {product.storeName}
                                            </div>
                                            {product.discountPercentage &&

                                                <div
                                                    className="rounded-full text-center p-1  animate-pulse"
                                                    style={{
                                                        backgroundColor: "#4222C4",
                                                        color: "white",
                                                        fontSize: '10px',
                                                        width: 'auto'
                                                    }}
                                                >
                                                    {product.discountPercentage}% OFF
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </Slider>
                )}
        </div>
    );
}
