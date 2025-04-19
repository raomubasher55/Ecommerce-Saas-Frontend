import React from "react";
import { BsMailbox } from "react-icons/bs";

const SuspendedStore = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Store Suspended</h1>
        <p className="text-gray-700 text-lg mb-6">
          This store is currently suspended. If you believe this is a mistake or need assistance, please contact the admin.
        </p>
        <a
          href="mailto:admin@example.com"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition"
        >
          <BsMailbox className="w-5 h-5" />
          Contact Admin
        </a>
      </div>
    </div>
  );
};

export default SuspendedStore;
