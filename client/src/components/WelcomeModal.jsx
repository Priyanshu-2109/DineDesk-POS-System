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

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-[#cc6600]" />,
      title: "Lightning Fast Orders",
      description: "Process orders in seconds with our intuitive interface",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#cc6600]" />,
      title: "Real-time Analytics",
      description: "Track sales, revenue, and performance with live dashboards",
    },
    {
      icon: <Shield className="h-6 w-6 text-[#cc6600]" />,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: <Smartphone className="h-6 w-6 text-[#cc6600]" />,
      title: "Cloud-Based Access",
      description: "Manage your restaurant from anywhere, anytime",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#cc6600] to-[#b35500] text-white px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to DineDesk!</h1>
          <p className="text-white/90 text-lg">
            Your Complete Restaurant Management Solution
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[50vh] overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Why DineDesk is Perfect for Your Restaurant
            </h2>
            <p className="text-gray-600 mb-6">
              DineDesk streamlines your restaurant operations with powerful
              features designed to increase efficiency, boost revenue, and
              enhance customer satisfaction.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-[#cc6600] p-4 rounded-r-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              What's Included:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Table & Order Management</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Menu Customization with Categories</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Payment Processing & Checkout</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Business Analytics & Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Email Bills & Notifications</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDontShowAgain}
            variant="secondary"
            className="flex-1"
          >
            Don't Show Again
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 bg-gradient-to-r from-[#cc6600] to-[#b35500] hover:from-[#b35500] hover:to-[#a04000]"
          >
            Get Started
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;
