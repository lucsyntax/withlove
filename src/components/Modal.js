import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ onClose, children }) => {
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleCloseClick}
    >
      <div
        className="relative w-full max-w-lg bg-white p-8 rounded-md"
        onClick={(e) => e.stopPropagation()} // Evita que o clique dentro do modal feche o modal
      >
        <button
          className="absolute top-2 right-2 text-black"
          onClick={handleCloseClick}
        >
          <FaTimes size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
