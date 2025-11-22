import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import paymentService from "../utils/paymentService";
import { useNavigate } from "react-router-dom";
import SubscriptionNotification from "./SubscriptionNotification";
import toast from "react-hot-toast";

const PaymentModal = ({ isOpen, onClose, plan, planDetails }) => {
  const { user, token, updateSubscription } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const handlePayment = async () => {
    if (!user || !token) {
      setError("Please log in to continue with payment");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const userDetails = {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      };

      const result = await paymentService.initiatePayment(
        plan,
        userDetails,
        token
      );

      if (result.success) {
        // Update user context with new subscription
        await updateSubscription(plan);

        // Close modal first
        onClose();

        // Show success toast
        toast.success("Payment successful!");

        // Show subscription notification
        setShowNotification(true);

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">
                Complete Payment
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 text-xl font-bold focus:outline-none focus:ring-0"
                disabled={isProcessing}
              >
                ×
              </button>
            </div>

            <div className="px-6 py-4">
              {planDetails && (
                <div className="mb-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {planDetails.name}
                    </h4>
                    <div className="text-3xl font-bold text-[#cc6600] mb-2">
                      ₹{planDetails.price}
                      <span className="text-sm font-normal text-gray-500">
                        /{planDetails.interval}
                      </span>
                    </div>
                    {planDetails.isYearly && (
                      <div className="text-sm text-green-600 mb-2 font-medium">
                        ₹
                        {Math.round(planDetails.price / 12).toLocaleString(
                          "en-IN"
                        )}
                        /month when paid yearly
                      </div>
                    )}
                    <p className="text-gray-600 text-sm mb-4">
                      {planDetails.description ||
                        `Subscribe to ${planDetails.name} plan`}
                    </p>
                  </div>

                  {planDetails.features && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Plan Features:
                      </h5>
                      <ul className="space-y-1">
                        {planDetails.features
                          .slice(0, 4)
                          .map((feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <span className="w-1.5 h-1.5 bg-[#cc6600] rounded-full mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        {planDetails.features.length > 4 && (
                          <li className="text-sm text-gray-500">
                            + {planDetails.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-[#cc6600] text-white py-3 rounded-lg hover:bg-[#b35500] transition-colors font-medium shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-0"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Pay ₹${planDetails?.price || 0} & Subscribe`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Razorpay. Your payment information
                  is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Notification */}
      <SubscriptionNotification
        show={showNotification}
        plan={planDetails}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default PaymentModal;
