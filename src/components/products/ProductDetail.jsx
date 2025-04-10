import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineShareAlt } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import RelatedViewProducts from './RelatedViewProducts';
import ProductReviews from './ProductReviews';
import SimilarProducts from './SimilarProducts';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleProduct } from '../../store/actions/productActions';
import { getActiveAdById } from '../../store/actions/adActions';
import { toast } from 'react-toastify';
import { getProductReviews } from '../../store/actions/reviewActions';

export default function ProductDetail({ productId, setOrderGuide , setToggleSidebar }) {
    const dispatch = useDispatch();
    const { product, products } = useSelector((state) => state.SingleproductDetails);
    const { reviews } = useSelector((state) => state.review);
    const { ad } = useSelector((state) => state.adData);
    const { store } = useSelector((state) => state.store);
    const [Products, setProducts] = useState(products || []);
    const [activeImage, setActiveImage] = useState(null);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setProducts(products);
    }, [products]);
    useEffect(() => {
        if (productId) {
            dispatch(getSingleProduct(productId));
        };
        if (productId) {
            dispatch(getActiveAdById(productId))
                dispatch(getProductReviews(productId));
        };
        if (productId) {
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        
            const isProductInWishlist = wishlist.some(item => item._id === productId);
        
            if (isProductInWishlist) {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }
        

    }, [dispatch, productId]);


    useEffect(() => {
        if (product?.images?.length > 0) {
            setActiveImage(product.images[0]);
        }
    }, [product]);
    const handleLeftClick = () => {
        if (sliderIndex > 0) setSliderIndex(sliderIndex - 1);
    };

    const handleRightClick = () => {
        if (sliderIndex < product?.images.length - 3) setSliderIndex(sliderIndex + 1);
    };

    const handleLikeToggle = (product) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; 
    
        const isProductInWishlist = wishlist.some(item => item._id === product._id);
    
        if (isProductInWishlist) {
            wishlist = wishlist.filter(item => item._id !== product._id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
            setLiked(false);
            toast.info("Product removed from wishlist."); 
        } else {
            if (wishlist.length >= 4) {
                toast.warning("You have already added 4 products to your wishlist.");
                return;
            }
            wishlist.push(product);
            localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
            setLiked(true);
            toast.success("Product added to wishlist!"); 
        }
    };
    
    

    const handleOrderSubmit = () => {
        window.scrollBy(0, 650);
        setOrderGuide(prev => prev + 1);
    };

    const handleOrderSubmitMobile = () => {
        setOrderGuide(prev => prev + 1);
        setToggleSidebar(prev => prev + 1)
    };



    // rating average 


const totalReviews = reviews.length;
const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
const starRating = (averageRating / 5) * 5;

    return (
        <div className="w-full lg:w-[75%] mx-auto md:p-8">
            <div className="flex flex-col lg:flex-row gap-4 p-3" style={{ boxShadow: '1px 1px 20px 1px lightgray' }}>
                {/* Top Image */}
                <div className="w-full lg:w-1/3">
                    <img
                        src={product ? `${import.meta.env.VITE_APP}/${activeImage?.url.replace(/\\/g, "/")}` : null}
                        alt="Selected Product"
                        className="w-full h-[230px] rounded-lg object-cover"
                    />
                    {/* Image Slider */}
                    <div className="flex items-center mt-6 md:mt-10">
                        <button
                            onClick={handleLeftClick}
                            className="bg-gray-300 p-2 py-1 border border-gray-400 rounded-full hover:bg-gray-400 disabled:opacity-50"
                            disabled={sliderIndex === 0}
                        >
                            &#8592;
                        </button>
                        <div className="flex items-center h-max px-1 overflow-hidden w-full">
                            <div
                                className="flex gap-2 transition-transform"
                                style={{ transform: `translateX(-${sliderIndex * 45}px)` }}
                            >
                                {product?.images?.map((image, idx) => (
                                    <img
                                        key={idx}
                                        src={`${import.meta.env.VITE_APP}/${image?.url.replace(/\\/g, "/")}`}
                                        alt={`Product ${idx + 1}`}
                                        onClick={() => setActiveImage(image)}
                                        className={`w-[40px] h-[40px] m-0 rounded-lg cursor-pointer object-cover border ${activeImage === image ? "border-blue-500" : "border-gray-300"
                                            }`}
                                    />
                                ))}

                            </div>
                        </div>
                        <button
                            onClick={handleRightClick}
                            className="bg-gray-300 p-2 py-1 rounded-full hover:bg-gray-400 disabled:opacity-50 border border-gray-400"
                            disabled={sliderIndex >= product?.images.length - 3}
                        >
                            &#8594;
                        </button>
                    </div>

                    <h3 className="mt-6 text-gray-800">SHARE THIS PRODUCT</h3>
                    <div className="flex items-center gap-4 mt-4">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Facebook"
                            className="text-[#4267B2] text-2xl hover:scale-110 transition-transform duration-200"
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Instagram"
                            className="text-[#E4405F] text-2xl hover:scale-110 transition-transform duration-200"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Twitter"
                            className="text-[#1DA1F2] text-2xl hover:scale-110 transition-transform duration-200"
                        >
                            <FaTwitter />
                        </a>
                    </div>

                    <div className="mt-12">
                        <Link to={'/'} className="text-[12px] text-yellow-700 hover:underline">Report incorrect product information</Link>
                    </div>
                </div>

                {/* images data */}
                <div className="w-full lg:w-10/12 p-2 border-red-600">
                    <div className="flex justify-between items-center">
                        {/* Badges */}
                        <div className="flex justify-between items-center">
                            {store &&
                                <h3 className="bg-[#4222C4] cursor-pointer text-white px-2 py-1 text-[11px] rounded font-medium">
                                    {store?.name}
                                </h3>
                            }
                            {ad &&
                                <h3 className="bg-[#FF5733] ml-2 rounded text-white px-2 py-1 text-[11px] font-medium">
                                    {ad.description}
                                </h3>
                            }
                        </div>

                        {/* Wishlist Button */}
                        <button
                            onClick={() => handleLikeToggle(product)}
                            className="text-xl text-[#FF5733] hover:scale-110 transition-transform duration-200"
                            aria-label="Toggle Wishlist"
                        >
                            {liked ? <FaHeart /> : <FaRegHeart />}
                        </button>
                    </div>

                    {/* Product Title */}
                    <h1 className="mt-8 text-lg font-semibold text-gray-800 leading-tight">
                        {product?.name || 'Product Title'}
                    </h1>

                    {/* Product Brand and Links */}
                    <p className="mt-6 text-sm text-gray-600">
                        Brand: <a href="#" className="text-[#264996] hover:underline">{store?.name || 'Brand Name'}</a> |{' '}
                        {/* <a href="#" className="text-[#264996] hover:underline">Similar products by {store?.name || 'Brand'}</a> */}
                    </p>

                    {/* Price Section */}
                    <div className="flex gap-2 mt-7 items-center">
                        {/* Discounted Price */}
                        <h1 className="text-xl font-bold text-gray-800">{product?.discountedPrice || 'Price'} A.D</h1>
                        {/* Original Price */}
                        {product?.discountedPrice && (
                            <h4 className="line-through text-sm text-gray-500">{product?.price} A.D</h4>
                        )}
                        {/* Discount */}
                        {product?.discountPercentage && <span className="text-sm font-medium text-[#FF5733]">-{product?.discountPercentage}%</span>}
                    </div>

                    {/* Delivery Info */}
                    <p className="mt-7 text-[12px] text-[#4222C4] font-bold">
                        {product?.description || 'Some of remaining articles'}
                    </p>
                    <p className="text-[13px] mt-2 text-[#4d771d]">
                        Stock only <span className="font-bold">{product?.stock} Remaining</span>
                    </p>

                    {/* Rating */}
                    <div className="mt-5 flex items-center gap-1">
                        {/* Stars */}
                        {[...Array(5)].map((_, index) => (
                            <span key={index} className={`text-2xl ${index < (product?.reviews?.length
                                ? starRating
                                : 0) ? 'text-yellow-500' : 'text-gray-300'}`}>
                                &#9733;
                            </span>
                        ))}

                        {/* Reviews Count */}
                        <p className="text-sm text-gray-500">
                            {product?.reviews?.length > 0
                                ? `(${product.reviews.length} reviews)`
                                : "(No reviews available)"}
                        </p>
                    </div>


                    <button onClick={handleOrderSubmit}
                        className="hidden sm:flex items-center justify-center mt-12 w-full gap-2 bg-[#4222C4] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
                        <FaShoppingCart className="text-lg" />
                        <span className="text-center">I Buy</span>
                    </button>
                    <button onClick={handleOrderSubmitMobile}
                        className="flex sm:hidden items-center justify-center mt-12 w-full gap-2 bg-[#4222C4] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
                        <FaShoppingCart className="text-lg" />
                        <span className="text-center">I Buy</span>
                    </button>

                    {/* Promotions */}
                    <div className="w-full h-mx mt-10">
                        <h1 className="text-lg font-bold mb-4">PROMOTIONS</h1>
                        <div className="flex items-center mb-4">
                            <AiOutlineShareAlt className="text-xl mr-2 text-blue-500" />
                            <span className=" text-[#4222C4] text-[13px]"><a href="/" className='hover:underline font-bold'>Cebelu.com</a> orders are eligible for free shipping. Offer subject to conditions.</span>
                        </div>
                    </div>
                </div>
            </div>
            <RelatedViewProducts Products={Products} store={store.name} />
            <ProductReviews product={product} />
            <SimilarProducts />
        </div>
    );
}
