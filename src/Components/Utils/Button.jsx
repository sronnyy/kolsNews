// src/Utils/Button.jsx

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const CustomButton = ({ loading, handleClick, children }) => {
  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-sm ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white border-none transition-all`}
      disabled={loading}
    >
      {loading ? <FaSpinner className="animate-spin text-xl" /> : children}
    </button>
  );
};

export default CustomButton;
