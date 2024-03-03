import React, { useRef } from 'react';
import useClickOutside from '@/app/lib/useClickOutside';
import icons from '@/app/lib/icons';

const Modal = ({
  width,
  children,
  showModal,
  setShowModal,
  toggleText,
}: {
  width?: string;
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  toggleText?: string;
}) => {
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => {
    setShowModal(false);
  });

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative flex flex-col">
      {showModal && <div className="fixed inset-0 bg-black opacity-40" />}

      {showModal && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded pb-12 pt-6 px-12 sm:max-w-${
            width ? `[${width}]` : '[42rem]'
          } max-h-[97%] overflow-y-auto z-40`}
          ref={wrapperRef}
        >
          <div className="flex justify-end w-full text-3xl">
            <button onClick={handleCloseModal} className="flex justify-end ">
              {icons.close}
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export default Modal;
