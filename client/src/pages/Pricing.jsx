import React, { useState, useEffect } from "react";
import { Check, Star, Award, Crown } from "lucide-react";
import { Button, Card } from "../components/ui";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import paymentService from "../utils/paymentService";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openContactModal, openAuthModal } = useApp();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();

    // Check if redirected from RequireAuth with payment requirement
    if (location.state?.requirePayment && isAuthenticated) {
      // Show a message that subscription is required
      setTimeout(() => {
        alert("Please subscribe to a plan to access the dashboard.");
      }, 500);
    }
  }, [location.state, isAuthenticated]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const result = await paymentService.getPlans();
      if (result.success) {
        setPlans(result.plans);
      } else {
        console.error("Failed to fetch plans:", result.message);
        // Fallback to default plans if API fails
        setPlans(getDefaultPlans());
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans(getDefaultPlans());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPlans = () => [
    {
      id: "starter",
      name: "Starter",
      price: 999,
      currency: "INR",
      interval: "month",
      description: "Perfect for small restaurants and cafes",
      features: [
        "Up to 5 tables",
        "Basic menu management",
        "Order tracking",
        "Email support",
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: 1999,
      currency: "INR",
      interval: "month",
      popular: true,
      description: "Ideal for growing restaurants",
      features: [
        "Up to 20 tables",
        "Advanced menu management",
        "Order tracking & analytics",
        "Customer management",
        "Priority support",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 2999,
      currency: "INR",
      interval: "month",
      description: "For large restaurant chains",
      features: [
        "Unlimited tables",
        "Full restaurant management",
        "Advanced analytics",
        "Multi-location support",
        "Dedicated support",
      ],
    },
  ];

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    // Create enhanced plan details with current pricing period
    const enhancedPlan = {
      ...plan,
      price: getDisplayPrice(plan.price),
      interval: isYearly ? "year" : plan.interval,
      originalPrice: plan.price,
      isYearly: isYearly,
    };

    setSelectedPlan(enhancedPlan);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case "starter":
        return Star;
      case "professional":
        return Award;
      case "enterprise":
        return Crown;
      default:
        return Star;
    }
  };
  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees! We'll help you get started for free, including data migration from your existing system.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! We use bank-grade encryption and comply with all Indian data protection regulations.",
    },
  ];

  // Function to calculate yearly price with 20% discount
  const calculateYearlyPrice = (monthlyPrice) => {
    return Math.round(monthlyPrice * 12 * 0.8);
  };

  // Function to get display price based on billing period
  const getDisplayPrice = (monthlyPrice) => {
    return isYearly ? calculateYearlyPrice(monthlyPrice) : monthlyPrice;
  };

  // Function to get original price (for strikethrough)
  const getOriginalPrice = (monthlyPrice, originalMonthlyPrice) => {
    return isYearly ? originalMonthlyPrice * 12 : originalMonthlyPrice;
  };

  // Function to calculate savings
  const getSavings = (monthlyPrice, originalMonthlyPrice) => {
    if (isYearly) {
      const yearlyPrice = calculateYearlyPrice(monthlyPrice);
      const fullYearlyPrice = monthlyPrice * 12;
      return fullYearlyPrice - yearlyPrice;
    } else {
      return originalMonthlyPrice - monthlyPrice;
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#ffe8db] to-[#fff4ef]">
      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#3b1a0b] mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Choose the perfect plan for your restaurant. All plans include our
            core POS features.
          </p>

          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="mr-2">🎉</span>
            Get started with a plan that fits your restaurant's needs
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    !isYearly
                      ? "bg-[#cc6600] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative ${
                    isYearly
                      ? "bg-[#cc6600] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc6600]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => {
                const IconComponent = getPlanIcon(plan.id);
                return (
                  <Card
                    key={plan.id || index}
                    className={`relative transition-all duration-300 hover:shadow-xl hover:scale-102 ${
                      plan.popular
                        ? "border-2 border-[#cc6600] ring-4 ring-[#cc6600]/20"
                        : "border border-gray-200"
                    }`}
                    padding="none"
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-[#cc6600] text-white px-4 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="p-8">
                      <div className="flex items-center justify-center mb-4">
                        <IconComponent className="h-12 w-12 text-[#cc6600]" />
                      </div>

                      <h3 className="text-2xl font-bold text-[#3b1a0b] text-center mb-2">
                        {plan.name}
                      </h3>

                      <p className="text-gray-600 text-center mb-6">
                        {plan.description || `Subscribe to ${plan.name} plan`}
                      </p>

                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center flex-col">
                          <div className="flex items-center justify-center">
                            <span className="text-4xl font-bold text-[#3b1a0b]">
                              ₹
                              {getDisplayPrice(plan.price)?.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                            <span className="text-gray-500">
                              /{isYearly ? "year" : plan.interval || "month"}
                            </span>
                          </div>
                          {isYearly && (
                            <div className="text-sm text-green-600 mt-2 font-medium">
                              ₹
                              {Math.round(
                                getDisplayPrice(plan.price) / 12
                              ).toLocaleString("en-IN")}
                              /month when paid yearly
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full mb-6 ${
                          plan.popular
                            ? "bg-[#cc6600] hover:bg-[#b35500] text-white"
                            : ""
                        }`}
                        variant={plan.popular ? "primary" : "outline"}
                      >
                        {!isAuthenticated
                          ? "Login to Subscribe"
                          : user?.subscription === plan.id
                          ? "Current Plan"
                          : "Subscribe Now"}
                      </Button>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-[#3b1a0b] mb-3">
                          Everything included:
                        </h4>
                        {plan.features?.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-12">
            Compare Plans & Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-[#cc6600]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3b1a0b] mb-2">
                  All Core Features
                </h3>
                <p className="text-gray-600">
                  Every plan includes our essential POS features
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-[#cc6600]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3b1a0b] mb-2">
                  24/7 Support
                </h3>
                <p className="text-gray-600">
                  Round-the-clock assistance when you need it
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-[#cc6600]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3b1a0b] mb-2">
                  No Setup Fees
                </h3>
                <p className="text-gray-600">
                  Get started immediately with zero hidden costs
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-[#cc6600]" />
                </div>
                <h3 className="text-xl font-semibold text-[#3b1a0b] mb-2">
                  Free Migration
                </h3>
                <p className="text-gray-600">
                  We'll help you migrate from any existing system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="transition-all duration-300 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-[#3b1a0b] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-[#3b1a0b] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of restaurants already using DineDesk to grow their
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={openContactModal}
              size="lg"
              className="bg-[#cc6600] hover:bg-[#b35500] text-white"
            >
              Start 14-Day Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-[#3b1a0b]"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Cancel anytime • 24/7 support
          </p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedPlan?.id}
        planDetails={selectedPlan}
      />
    </div>
  );
};

export default Pricing;
