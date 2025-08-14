import React, { useState } from "react";
import {
  Check,
  ArrowRight,
  User,
  Store,
  Utensils,
  CreditCard,
  Play,
  Users,
} from "lucide-react";
import { Button, Card } from "../components/ui";

const Setup = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up and verify your restaurant details",
      icon: User,
      duration: "2 minutes",
      tasks: [
        "Sign up with email and password",
        "Verify your email address",
        "Complete restaurant profile",
        "Add contact information",
      ],
    },
    {
      title: "Restaurant Setup",
      description: "Configure your restaurant information and settings",
      icon: Store,
      duration: "5 minutes",
      tasks: [
        "Add restaurant name and address",
        "Set operating hours",
        "Configure tax settings",
        "Upload restaurant logo",
      ],
    },
    {
      title: "Menu Configuration",
      description: "Add your menu items, categories, and pricing",
      icon: Utensils,
      duration: "15 minutes",
      tasks: [
        "Create menu categories",
        "Add menu items with descriptions",
        "Set prices and variants",
        "Upload food images",
      ],
    },
    {
      title: "Table & Seating Setup",
      description: "Configure your dining area and table layout",
      icon: Users,
      duration: "10 minutes",
      tasks: [
        "Add dining areas (floors/sections)",
        "Create tables with capacity",
        "Set table numbers and names",
        "Configure seating arrangements",
      ],
    },
    {
      title: "Payment Methods",
      description: "Set up payment processing and billing options",
      icon: CreditCard,
      duration: "5 minutes",
      tasks: [
        "Connect payment gateways",
        "Configure cash handling",
        "Set up digital payments (UPI, cards)",
        "Test payment processing",
      ],
    },
    {
      title: "Go Live",
      description: "Launch your restaurant POS system",
      icon: Play,
      duration: "1 minute",
      tasks: [
        "Review all settings",
        "Train your staff",
        "Process your first order",
        "Start serving customers",
      ],
    },
  ];

  const features = [
    "Complete setup in under 30 minutes",
    "Import existing menu data",
    "Free migration assistance",
    "24/7 setup support",
    "Training materials included",
    "No technical expertise required",
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-[#ffe8db] to-[#fff4ef]">
      {/* Hero Section */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#3b1a0b] mb-6">
            Easy Setup in 6 Simple Steps
          </h1>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Get your restaurant POS system up and running in minutes. Our guided
            setup process makes it easy to configure everything you need.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#3b1a0b] text-center mb-8">
              Setup Process
            </h2>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 ${
                      index <= activeStep
                        ? "bg-[#cc6600] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all duration-300 ${
                        index < activeStep ? "bg-[#cc6600]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Step Info */}
            <div>
              <Card className="p-8">
                <div className="flex items-center mb-6">
                  {React.createElement(steps[activeStep].icon, {
                    className: "h-12 w-12 text-[#cc6600] mr-4",
                  })}
                  <div>
                    <h3 className="text-2xl font-bold text-[#3b1a0b]">
                      {steps[activeStep].title}
                    </h3>
                    <p className="text-gray-600">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>Estimated time: {steps[activeStep].duration}</span>
                  </div>

                  <h4 className="font-semibold text-[#3b1a0b] mb-3">
                    What you'll do:
                  </h4>
                  <ul className="space-y-2">
                    {steps[activeStep].tasks.map((task, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    variant="outline"
                    disabled={activeStep === 0}
                    className="flex-1"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setActiveStep(Math.min(steps.length - 1, activeStep + 1))
                    }
                    className="flex-1 bg-[#cc6600] hover:bg-[#b35500] text-white"
                    disabled={activeStep === steps.length - 1}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* All Steps Overview */}
            <div>
              <h3 className="text-xl font-bold text-[#3b1a0b] mb-6">
                Complete Setup Guide
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-300 ${
                        index === activeStep
                          ? "border-[#cc6600] bg-[#cc6600]/5"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setActiveStep(index)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-full ${
                            index <= activeStep
                              ? "bg-[#cc6600]/10"
                              : "bg-gray-100"
                          }`}
                        >
                          <IconComponent
                            className={`h-6 w-6 ${
                              index <= activeStep
                                ? "text-[#cc6600]"
                                : "text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#3b1a0b]">
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {step.duration}
                          </p>
                        </div>
                        {index <= activeStep && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#3b1a0b] mb-6">
            Need Help Getting Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our setup team is here to help you every step of the way
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-[#cc6600]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3b1a0b] mb-2">
                Personal Onboarding
              </h3>
              <p className="text-gray-600 text-sm">
                One-on-one setup assistance via video call
              </p>
            </Card>

            <Card className="text-center">
              <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-[#cc6600]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3b1a0b] mb-2">
                Video Tutorials
              </h3>
              <p className="text-gray-600 text-sm">
                Step-by-step video guides for each process
              </p>
            </Card>

            <Card className="text-center">
              <div className="h-16 w-16 bg-[#cc6600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-[#cc6600]" />
              </div>
              <h3 className="text-lg font-semibold text-[#3b1a0b] mb-2">
                Free Migration
              </h3>
              <p className="text-gray-600 text-sm">
                We'll help migrate data from your current system
              </p>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#cc6600] hover:bg-[#b35500] text-white"
            >
              Schedule Setup Call
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo Video
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 bg-[#3b1a0b] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of restaurants that chose DineDesk for their POS
            needs
          </p>
          <Button
            size="lg"
            className="bg-[#cc6600] hover:bg-[#b35500] text-white"
          >
            Start Free Setup
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required • Free setup assistance • 14-day trial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setup;
