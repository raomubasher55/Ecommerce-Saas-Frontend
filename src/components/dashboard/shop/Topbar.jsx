import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStore } from "../../../store/actions/storeActions";
import ConfirmLogoutModal from '../../presentation/modals/ConfirmLogoutModal';
import StoreNotificationBell from "../../notifications/StoreNotificationBell";
import logo from "../../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const { store, loading } = useSelector((state) => state.store);
    const navigate = useNavigate();

    useEffect(() => {
        const storeToken = localStorage.getItem("storeToken");
        if (storeToken) {
            dispatch(fetchStore());
        }
    }, [dispatch]);

    const handleLogoutClick = () => {
        setModalVisible(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("storeToken");
        setModalVisible(false);
        window.location.href = "/";
    };

    const handleCancelLogout = () => {
        setModalVisible(false);
    };

    return (
        <div className="w-full bg-white shadow h-[80px] flex justify-between items-center px-2 sm:px-6 text-gray-800">
            <Link to={'/'} className="text-2xl font-bold text-[#4222C4]">
                <img className="w-24 md:w-28 h-8 md:h-10 m-0 p-0" src={logo} alt="cebelu logo" />
            </Link>

            <h1 className="text-2xl font-bold text-[#4222C4] hidden md:block">Store Dashboard</h1>

            <div className="flex items-center space-x-4 md:space-x-6">
                <div className="relative">
                    <StoreNotificationBell />
                </div>

                <div className="relative">
                    <button
                        className="flex items-center space-x-3"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        {loading ? (
                            <p>Loading...</p>
                        ) : store ? (
                            <>
                                <img
                                    src={`${import.meta.env.VITE_APP}${store?.photo?.url}`}
                                    alt={store.name} className="w-10 h-10 rounded-full" />
                                <span className="hidden sm:block text-[#4222C4] font-bold">
                                    {store.name}
                                </span>
                            </>
                        ) : (
                            <span className="hidden sm:block text-[#4222C4] font-bold">User</span>
                        )}
                        <FaChevronDown className="text-lg font-bold text-[#4222C4]" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg">
                            <button
                                onClick={handleLogoutClick}
                                className="block px-4 py-2 hover:bg-gray-50 text-gray-800 border w-full"
                            >
                                Log Out Store
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmLogoutModal
                isVisible={isModalVisible}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </div>
    );
}
