import { Icon } from "@iconify/react";

export const FooterSendEmail = () => {
  return (
    <div className="flex flex-col sm:flex-grow mt-4 sm:mt-0">
      <h1 className="font-bold text-sm text-gray-100">NEW TO CEBLEU?</h1>
      <p className="text-xs text-gray-300 my-2">
        Subscribe to our newsletter to get updates on our latest offers!
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 pb-3">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Icon icon="mdi:email" color="#75757A" height="20" />
          </span>
          <input
            type="text"
            placeholder="Enter E-mail Address"
            className="w-full sm:w-[17rem] pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* <div className="flex gap-2">
          <button className="shadow-lg uppercase px-4 py-2 text-sm text-gray-100 hover:text-black border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
            Male
          </button>
          <button className="shadow-lg uppercase px-4 py-2 text-sm text-gray-100 hover:text-black border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
            Female
          </button>
        </div> */}
      </div>
    </div>
  );
};
