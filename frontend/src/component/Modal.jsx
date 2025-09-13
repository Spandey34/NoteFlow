import React from 'react';

export default function Modal({ children, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel} 
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-300"
        onClick={(e) => e.stopPropagation()} 
      >
        {children}
      </div>
    </div>
  );
}