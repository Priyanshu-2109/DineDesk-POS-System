import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import PaymentModal from "../components/PaymentModal";
import paymentService from "../utils/paymentService";
import {
  ArrowRight,
  Check,
  Users,
  BarChart3,
  Smartphone,
  Shield,
} from "lucide-react";

const Home = () => {
  const { openAuthModal, openContactModal } = useApp();
  const { isAuthenticated, user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate yearly price with 20% discount
  const calculateYearlyPrice = (monthlyPrice) => {
    return Math.round(monthlyPrice * 12 * 0.8);
  };

  // Function to get display price based on billing period
  const getDisplayPrice = (monthlyPrice) => {
    return isYearly ? calculateYearlyPrice(monthlyPrice) : monthlyPrice;
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const result = await paymentService.getPlans();
      if (result.success) {
        setPlans(result.plans);
      } else {
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
        "Up to 10 tables",
        "Basic reporting",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      id: "professional",
      name: "Professional",
      price: 2499,
      currency: "INR",
      interval: "month",
      description: "Ideal for growing restaurants",
      features: [
        "Up to 50 tables",
        "Advanced analytics",
        "Priority support",
        "Inventory management",
        "Multi-location support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 4999,
      currency: "INR",
      interval: "month",
      description: "For large restaurant chains",
      features: [
        "Unlimited tables",
        "Custom integrations",
        "Dedicated support",
        "White-label options",
        "API access",
      ],
      popular: false,
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

  const features = [
    {
      title: "Smart Ordering",
      desc: "Lightning-fast order management with intuitive interface",
      icon: BarChart3,
    },
    {
      title: "Table Management",
      desc: "Visual seating plans and real-time table status tracking",
      icon: Users,
    },
    {
      title: "Analytics & Reports",
      desc: "Detailed insights and reporting for business growth",
      icon: BarChart3,
    },
    {
      title: "Multi-Device Support",
      desc: "Works seamlessly across tablets, phones, and desktop",
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#ffe8db] to-[#fff4ef] min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-[#3b1a0b] mb-8 drop-shadow-sm mt-8">
            Modern POS for <span className="text-[#cc6600]">Restaurants</span>
          </h1>

          <p className="text-gray-700 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            Streamline your restaurant operations with our powerful
            point-of-sale system. Manage tables, orders, and payments all in one
            place.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
            <button
              onClick={() => openAuthModal("signup")}
              className="px-8 py-4 bg-[#cc6600] text-white rounded-xl font-semibold text-lg hover:bg-[#b35500] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 focus:outline-none focus:ring-0"
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
            <Link
              to="/pricing"
              className="px-8 py-4 border-2 border-[#3b1a0b] text-[#3b1a0b] rounded-xl font-semibold text-lg hover:bg-[#3b1a0b] hover:text-white transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#3b1a0b] mb-6">
              Everything you need to run your restaurant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive POS system helps restaurants of all sizes
              operate more efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-16 w-16 bg-[#cc6600]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-[#cc6600]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#3b1a0b] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#fff4ef] to-[#ffe8db]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#3b1a0b] mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your restaurant
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                    !isYearly
                      ? "bg-[#cc6600] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 relative focus:outline-none focus:ring-0 ${
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

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc6600]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={plan.id || index}
                  className={`bg-white rounded-2xl p-8 relative transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? "border-2 border-[#cc6600] scale-105"
                      : "border border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#cc6600] text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#3b1a0b] mb-4">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center flex-col">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-[#3b1a0b]">
                          ₹{getDisplayPrice(plan.price).toLocaleString("en-IN")}
                        </span>
                        <span className="text-gray-500 ml-2">
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

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-0 ${
                      plan.popular
                        ? "bg-[#cc6600] text-white hover:bg-[#b35500]"
                        : "border-2 border-[#cc6600] text-[#cc6600] hover:bg-[#cc6600] hover:text-white"
                    }`}
                  >
                    {!isAuthenticated
                      ? "Login to Subscribe"
                      : user?.subscription === plan.id
                      ? "Current Plan"
                      : "Subscribe Now"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 text-[#cc6600] hover:text-[#b35500] font-semibold"
            >
              View detailed pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#3b1a0b] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your restaurant?
          </h2>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Join thousands of restaurants that trust DineDesk to manage their
            operations
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={openContactModal}
              className="px-8 py-4 bg-[#cc6600] text-white rounded-xl font-semibold text-lg hover:bg-[#b35500] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-0"
            >
              Start Your Free Trial
            </button>
            <Link
              to="/setup"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[#3b1a0b] transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

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

export default Home;
