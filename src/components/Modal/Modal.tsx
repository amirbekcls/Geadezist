import React from 'react';
import { IoMdCloseCircleOutline } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const GlobalModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 relative"
      >
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          <IoMdCloseCircleOutline size={24} />
        </button>
        {/* Children */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;
