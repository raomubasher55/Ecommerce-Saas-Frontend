import { Icon } from "@iconify/react";
import logo from '../../../assets/logo 4.png'

export const FooterDownLoadApp = () => {
  return (
    <div className="flex flex-col sm:flex-grow mt-4 sm:mt-0">
      <div className="flex items-center">
        <div className="h-[2.5rem] w-[2.5rem] bg-gray-200 flex items-center justify-center rounded-md">
          <img src={logo} alt="logo" className="w-[90%] h-[80%] m-0" />
        </div>
        <div className="ml-4">
          <h1 className="text-sm font-bold text-gray-100">
            DOWNLOAD CEBLEU FREE APP
          </h1>
          <p className="text-xs text-gray-300">Get access to exclusive offers!</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button className="flex items-center px-4 py-2 bg-[#313133] text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-blue-500">
          <Icon icon="ic:baseline-apple" width="25" />
          <div className="ml-2 text-left">
            <p className="text-[0.6rem] text-gray-300">Download on the</p>
            <h1 className="text-sm font-semibold">App Store</h1>
          </div>
        </button>
        <button className="flex items-center px-4 py-2 bg-[#313133] text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-blue-500">
          <Icon icon="mdi:google-play" width="25" />
          <div className="ml-2 text-left">
            <p className="text-[0.6rem] text-gray-300">Get it on</p>
            <h1 className="text-sm font-semibold">Google Play</h1>
          </div>
        </button>
      </div>
    </div>
  );
};
