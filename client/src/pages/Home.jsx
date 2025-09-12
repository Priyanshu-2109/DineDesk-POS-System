import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  ArrowRight,
  Check,
  Users,
  BarChart3,
  Smartphone,
  Shield,
} from "lucide-react";

const Home = () => {
  const { openAuthModal } = useApp();

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

  const pricingPlans = [
    {
      name: "Starter",
      price: 999,
      period: "month",
      features: [
        "Up to 10 tables",
        "Basic reporting",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: 2499,
      period: "month",
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
      name: "Enterprise",
      price: 4999,
      period: "month",
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
              className="px-8 py-4 bg-[#cc6600] text-white rounded-xl font-semibold text-lg hover:bg-[#b35500] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
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
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#3b1a0b]">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
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
                  onClick={() => openAuthModal("signup")}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#cc6600] text-white hover:bg-[#b35500]"
                      : "border-2 border-[#cc6600] text-[#cc6600] hover:bg-[#cc6600] hover:text-white"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

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
              onClick={() => openAuthModal("signup")}
              className="px-8 py-4 bg-[#cc6600] text-white rounded-xl font-semibold text-lg hover:bg-[#b35500] transition-all duration-300 transform hover:scale-105"
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
    </div>
  );
};

export default Home;
