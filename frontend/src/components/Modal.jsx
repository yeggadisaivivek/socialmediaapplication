import React from 'react';

const Modal = ({ isOpen, onClose, direction, children }) => {
  let translateClass, alignClass;
  if (direction === 'left') {
    translateClass = isOpen ? 'translate-x-0' : '-translate-x-full';
    alignClass = 'justify-start';
  } else if (direction === 'right') {
    translateClass = isOpen ? 'translate-x-0' : 'translate-x-full';
    alignClass = 'justify-end';
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start ${alignClass} transition-transform duration-300 bg-black bg-opacity-50 ${translateClass}`}
    >
      <div className="bg-white w-3/4 h-full p-6 rounded-lg shadow-lg relative">
        <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
