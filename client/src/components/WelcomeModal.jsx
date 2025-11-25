import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  Zap,
  TrendingUp,
  Shield,
  Smartphone,
} from "lucide-react";
import Button from "./ui/Button";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("dinedesk_welcome_seen");

    if (!hasSeenWelcome) {
      // Show modal after a short delay for better UX
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("dinedesk_welcome_seen", "true");
  };

  const handleDontShowAgain = () => {
    setIsOpen(false);
    localStorage.setItem("dinedesk_welcome_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] animate-slide-up max-w-[calc(100vw-2rem)] w-full sm:w-96">
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] text-white px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-base md:text-xl font-bold">
              Welcome to DineDesk!
            </h1>
          </div>
          <p className="text-white/90 text-xs md:text-sm">
            Your Complete Restaurant Management Solution
          </p>
        </div>

        {/* Content */}
        <div className="px-4 py-4 md:px-6 md:py-5 max-h-[50vh] md:max-h-96 overflow-y-auto">
          <p className="text-gray-700 text-xs md:text-sm mb-3 md:mb-4">
            DineDesk streamlines your restaurant operations with powerful
            features designed to boost efficiency and revenue.
          </p>

          {/* Key Features */}
          <div className="space-y-2 md:space-y-2.5 mb-4 md:mb-5">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm text-gray-700">
                Table & Order Management
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm text-gray-700">
                Menu Customization
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm text-gray-700">
                Real-time Analytics
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs md:text-sm text-gray-700">
                Payment Processing
              </span>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-2.5 md:p-3 rounded-lg">
            <p className="text-xs text-gray-700 mb-0 md:mb-2 font-medium">
              🎉 Get started now and experience seamless restaurant management!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleDontShowAgain}
            className="flex-1 px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Don't Show Again
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-semibold bg-gradient-to-r from-[#cc6600] to-[#b35500] hover:from-[#b35500] hover:to-[#a04000] text-white rounded-lg transition-all shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
