import React, { useState } from "react";
import { Modal, Button, Input } from "./ui";

const CustomerDetailsModal = ({ isOpen, onClose, onSubmit, planDetails }) => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!customerData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...customerData, ...planDetails });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[#3b1a0b] mb-4">
          Complete Your Purchase
        </h2>

        {planDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#3b1a0b]">
              {planDetails.planName} Plan
            </h3>
            <p className="text-gray-600">
              ₹{planDetails.amount?.toLocaleString("en-IN")} /{" "}
              {planDetails.isYearly ? "year" : "month"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Full Name"
              type="text"
              value={customerData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              error={errors.name}
              required
            />
          </div>

          <div>
            <Input
              label="Email Address"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
              error={errors.email}
              required
            />
          </div>

          <div>
            <Input
              label="Phone Number"
              type="tel"
              value={customerData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
              error={errors.phone}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#cc6600] hover:bg-[#b35500] text-white"
            >
              Proceed to Payment
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Your information is secure and will only be used for payment
          processing.
        </p>
      </div>
    </Modal>
  );
};

export default CustomerDetailsModal;
