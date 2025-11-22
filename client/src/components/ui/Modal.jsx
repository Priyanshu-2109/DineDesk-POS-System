import React from "react";
import { X } from "lucide-react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className = "",
  showCloseButton = true,
  overlay = true,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        />
      )}

      {/* Modal */}
      <div
        className={`relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 w-full ${sizes[size]} ${className} max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/30 sticky top-0 bg-white/90 backdrop-blur-lg z-10">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-[#3b1a0b]">{title}</h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100/50"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

const ModalHeader = ({ children, className = "" }) => (
  <div className={`border-b border-gray-200/30 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

const ModalTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-[#3b1a0b] ${className}`}>
    {children}
  </h3>
);

const ModalContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

const ModalFooter = ({ children, className = "" }) => (
  <div
    className={`border-t border-gray-200/30 pt-4 mt-4 flex justify-end space-x-3 ${className}`}
  >
    {children}
  </div>
);

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
