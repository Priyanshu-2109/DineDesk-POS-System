import React, { useEffect, useState } from "react";
import { CheckCircle, X, Sparkles } from "lucide-react";

const SubscriptionNotification = ({ show, plan, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      // Slide in
      setTimeout(() => setIsVisible(true), 100);
      setTimeout(() => setIsAnimating(true), 150);

      // Auto-dismiss after 6 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ maxWidth: "400px" }}
    >
      <div className="bg-white rounded-xl shadow-2xl border-2 border-green-500 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg">Subscription Active!</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                Welcome to {plan?.name || "Premium"}!
              </h3>
              <p className="text-gray-600 text-sm">
                Your subscription has been activated successfully. Enjoy all
                premium features!
              </p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">Plan:</span>
              <span className="text-sm font-bold text-green-700">
                {plan?.name || "Premium"}
              </span>
            </div>
            {plan?.price && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  Amount Paid:
                </span>
                <span className="text-sm font-bold text-green-700">
                  ₹{plan.price}
                </span>
              </div>
            )}
          </div>

          {/* Features unlocked message */}
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              ✨ All premium features are now unlocked ✨
            </p>
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-[6000ms] ease-linear"
            style={{ width: isAnimating ? "0%" : "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionNotification;
