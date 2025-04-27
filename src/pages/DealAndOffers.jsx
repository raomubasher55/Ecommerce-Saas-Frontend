import { HeroBanner } from "../components/homepage/HeroBanner";
import Navbar from "../components/homepage/Navbar";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import FlashSales from "../components/presentation/FlashSales";
import { FooterPrime } from "../components/presentation/FooterPrime";
import TopDeals from "../components/presentation/TopDeals";
import SponseredProducts from '../components/presentation/SponseredProducts'
import { useNavigate } from "react-router-dom";
export default function DealAndOffers() {
    const navigate = useNavigate();
    return (
        <div>

            <HeroBanner />
            <Navbar />

                      <button
            onClick={() => navigate('/')}
            className="inline-block mt-10 ml-10 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 
            rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
            Go Back
        </button>
            <TopDeals />
            <FlashSales />
            <SponseredProducts />
            <FooterPrime />
            <AllAbouJumiaFooter />
        </div>
    )
}
