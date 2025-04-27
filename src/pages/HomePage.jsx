import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CategoryNavigationMenu } from "../components/homepage/CategoryNavigationMenu";
import { HelpCenterCard } from "../components/homepage/HelpCenterCard";
import { HeroBanner } from "../components/homepage/HeroBanner";
import Navbar from "../components/homepage/Navbar";
import { WelcomeSalesSlider } from "../components/homepage/WelcomeSalesSlider";
import BestOffers from "../components/presentation/BestOffers";
import OfficialLinks from "../components/presentation/OfficialLinks";
import TopDeals from "../components/presentation/TopDeals";
import BestBrands from "../components/presentation/BestBrands";
import FlashSales from "../components/presentation/FlashSales";
import AllStoreProduct from "../components/presentation/AllStoreProduct";
import CategoriesSection from "../components/presentation/CategoriesSection";
import SponseredProducts from "../components/presentation/SponseredProducts";
import OfficialStores from "../components/presentation/OfficialStores";
import { FooterPrime } from "../components/presentation/FooterPrime";
import { AllAbouJumiaFooter } from "../components/presentation/AllAbouJumiaFooter";
import ProductsByCategory from "../components/presentation/ProductsByCategory";
import { useSelector } from "react-redux";


export default function HomePage() {
    const store = useSelector((state) => state.store);
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-col items-center container">
                <HeroBanner />
                <Navbar />
            </div>

            <div className="flex flex-col md:flex-row container mx-auto px-4 space-y-4 md:space-y-0 md:space-x-4 overflow-hidden mb-10">
                <CategoryNavigationMenu />
                <WelcomeSalesSlider />
                <HelpCenterCard />
            </div>

            <OfficialLinks />
            <TopDeals />
            <BestOffers />
            <BestBrands />
            <FlashSales />
            <AllStoreProduct />
            <CategoriesSection />
            <SponseredProducts />
            <OfficialStores />
            <ProductsByCategory />
            <FooterPrime />
            <AllAbouJumiaFooter />

        </div>
    )
}
