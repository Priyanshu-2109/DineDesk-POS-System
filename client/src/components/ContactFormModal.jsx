import React, { useState } from "react";
import {
  X,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Modal, Button, Input } from "./ui";

const ContactFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurantName: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { name, email, phone, restaurantName } = formData;
    return name.trim() && email.trim() && phone.trim() && restaurantName.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call for demo
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          restaurantName: "",
          message: "",
        });
        onClose();
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        restaurantName: "",
        message: "",
      });
      onClose();
    }
  };

  if (submitted) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="md"
        closeOnOverlayClick={false}
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            🎉 Request Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for your interest in <span className="font-semibold">DineDesk</span>!  
            Our enterprise team will contact you within 24 hours to set up your free trial.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left shadow-sm">
            <p className="text-blue-900 font-semibold">What happens next?</p>
            <ul className="text-blue-800 text-sm mt-2 space-y-1 list-disc pl-5">
              <li>Our team will call you to understand your requirements</li>
              <li>We’ll set up a personalized demo environment</li>
              <li>You’ll get 30 days of free access to all features</li>
            </ul>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-[#3b1a0b]">
              Start Your Free Trial
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              Get 30 days of free access to all DineDesk features
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1 text-gray-500" />
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4 inline mr-1 text-gray-500" />
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-1 text-gray-500" />
                Phone Number *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="h-4 w-4 inline mr-1 text-gray-500" />
                Restaurant Name *
              </label>
              <Input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                placeholder="Enter restaurant name"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageSquare className="h-4 w-4 inline mr-1 text-gray-500" />
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us about your restaurant, number of tables, or any specific requirements..."
              rows={4}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent resize-none shadow-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !validateForm()}
              className="flex-1 bg-[#cc6600] hover:bg-[#b35500] text-white rounded-lg shadow-md transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  Start Free Trial
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContactFormModal;
