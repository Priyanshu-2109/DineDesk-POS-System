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
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className="relative bg-white rounded-2xl shadow-2xl w-96 border-2 border-gray-200 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] text-white px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">Welcome to DineDesk!</h1>
          </div>
          <p className="text-white/90 text-sm">
            Your Complete Restaurant Management Solution
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-96 overflow-y-auto">
          <p className="text-gray-700 text-sm mb-4">
            DineDesk streamlines your restaurant operations with powerful
            features designed to boost efficiency and revenue.
          </p>

          {/* Key Features */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">
                Table & Order Management
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">Menu Customization</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">Real-time Analytics</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">Payment Processing</span>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 p-3 rounded-lg">
            <p className="text-xs text-gray-700 mb-2 font-medium">
              🎉 Get started now and experience seamless restaurant management!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleDontShowAgain}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Don't Show Again
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-3 py-2 text-sm font-semibold bg-gradient-to-r from-[#cc6600] to-[#b35500] hover:from-[#b35500] hover:to-[#a04000] text-white rounded-lg transition-all shadow-sm"
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
