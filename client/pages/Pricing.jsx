import React from "react";
import { Check, Star, Award, Crown } from "lucide-react";
import { Button, Card } from "../components/ui";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: 999,
      originalPrice: 1499,
      period: "month",
      description: "Perfect for small restaurants and cafes",
      icon: Star,
      popular: false,
      features: [
        "Up to 10 tables",
        "Basic POS system",
        "Menu management",
        "Order tracking",
        "Basic reporting",
        "Email support",
        "Mobile app access",
        "₹2,000 worth of free templates",
      ],
    },
    {
      name: "Professional",
      price: 2499,
      originalPrice: 3499,
      period: "month",
      description: "Ideal for growing restaurants",
      icon: Award,
      popular: true,
      features: [
        "Up to 50 tables",
        "Advanced POS system",
        "Multi-location support",
        "Inventory management",
        "Staff management",
        "Advanced reporting & analytics",
        "WhatsApp integration",
        "Priority support",
        "Custom branding",
        "₹10,000 worth of premium features",
      ],
    },
    {
      name: "Enterprise",
      price: 4999,
      originalPrice: 6999,
      period: "month",
      description: "For large restaurants and chains",
      icon: Crown,
      popular: false,
      features: [
        "Unlimited tables",
        "Enterprise POS system",
        "Multi-brand management",
        "Advanced inventory & supply chain",
        "HR & payroll integration",
        "Real-time analytics dashboard",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "₹25,000 worth of enterprise tools",
      ],
    },
  ];

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
            Limited Time: 30% OFF on all annual plans
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={index}
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
                      {plan.description}
                    </p>

                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-4xl font-bold text-[#3b1a0b]">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 mt-1">
                        <span className="text-lg text-gray-400 line-through">
                          ₹{plan.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          Save ₹
                          {(plan.originalPrice - plan.price).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      className={`w-full mb-6 ${
                        plan.popular
                          ? "bg-[#cc6600] hover:bg-[#b35500] text-white"
                          : ""
                      }`}
                      variant={plan.popular ? "primary" : "outline"}
                    >
                      {plan.popular ? "Start Free Trial" : "Get Started"}
                    </Button>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#3b1a0b] mb-3">
                        Everything included:
                      </h4>
                      {plan.features.map((feature, featureIndex) => (
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
    </div>
  );
};

export default Pricing;
