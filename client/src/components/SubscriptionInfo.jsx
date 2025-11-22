import React from "react";
import { useAuth } from "../context/AuthContext";
import { Crown, Calendar, CreditCard, CheckCircle } from "lucide-react";

const SubscriptionInfo = () => {
  const { user } = useAuth();

  if (!user?.subscriptionDetails || !user.subscription) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-6 w-6 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900">Subscription</h3>
        </div>
        <p className="text-gray-600">
          No active subscription. Subscribe to unlock all features!
        </p>
        <a
          href="/pricing"
          className="mt-4 inline-block px-6 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-colors font-medium"
        >
          View Plans
        </a>
      </div>
    );
  }

  const { subscriptionDetails } = user;
  const { planId, amount, currency, interval, startDate, endDate, status } =
    subscriptionDetails;

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const getPlanColor = () => {
    switch (planId) {
      case "enterprise":
        return "from-purple-500 to-purple-700";
      case "professional":
        return "from-[#cc6600] to-[#b35500]";
      case "starter":
        return "from-blue-500 to-blue-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const getPlanName = () => {
    switch (planId) {
      case "enterprise":
        return "Enterprise";
      case "professional":
        return "Professional";
      case "starter":
        return "Starter";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-[#cc6600]" />
          <h3 className="text-xl font-semibold text-gray-900">
            Your Subscription
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Plan Card */}
      <div
        className={`bg-gradient-to-r ${getPlanColor()} rounded-lg p-6 text-white mb-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-2xl font-bold">{getPlanName()} Plan</h4>
            <p className="text-white/90 text-sm mt-1">
              Premium features unlocked
            </p>
          </div>
          <CheckCircle className="h-12 w-12 text-white/90" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {currency === "INR" ? "₹" : "$"}
            {amount.toLocaleString()}
          </span>
          <span className="text-white/90">/{interval}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="h-5 w-5 text-[#cc6600]" />
          <div className="flex-1">
            <p className="text-sm font-medium">Started</p>
            <p className="text-sm text-gray-600">
              {new Date(startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <CreditCard className="h-5 w-5 text-[#cc6600]" />
          <div className="flex-1">
            <p className="text-sm font-medium">Renewal Date</p>
            <p className="text-sm text-gray-600">
              {new Date(endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Days Remaining Alert */}
        {isExpired ? (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-sm">
              ⚠️ Your subscription has expired. Renew now to continue enjoying
              premium features.
            </p>
            <a
              href="/pricing"
              className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Renew Subscription
            </a>
          </div>
        ) : isExpiringSoon ? (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 font-medium text-sm">
              ⏰ Your subscription expires in {daysRemaining} day
              {daysRemaining !== 1 ? "s" : ""}
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium text-sm">
              ✓ {daysRemaining} days remaining in your subscription
            </p>
          </div>
        )}
      </div>

      {/* Manage Subscription */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <a
          href="/pricing"
          className="text-[#cc6600] hover:text-[#b35500] font-medium text-sm flex items-center gap-2"
        >
          <span>Upgrade or Change Plan</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
