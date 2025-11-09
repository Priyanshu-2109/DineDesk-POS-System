// Razorpay integration utility
class RazorpayService {
  constructor() {
    this.razorpay = null;
    this.isScriptLoaded = false;
  }

  // Load Razorpay script dynamically
  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      console.log("Loading Razorpay script...");

      if (this.isScriptLoaded && window.Razorpay) {
        console.log("Razorpay script already loaded");
        resolve(window.Razorpay);
        return;
      }

      // Check if script is already present in head
      const existingScript = document.querySelector(
        'script[src*="checkout.razorpay.com"]'
      );
      if (existingScript && window.Razorpay) {
        console.log(
          "Razorpay script found in head and window.Razorpay available"
        );
        this.isScriptLoaded = true;
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        this.isScriptLoaded = true;
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error("Razorpay object not found after script load"));
        }
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        reject(new Error("Failed to load Razorpay script"));
      };
      document.head.appendChild(script);
    });
  }

  // Initialize payment
  async initializePayment(options) {
    try {
      console.log("Initializing Razorpay payment with options:", options);

      const Razorpay = await this.loadRazorpayScript();

      if (!Razorpay) {
        throw new Error("Razorpay script failed to load");
      }

      const defaultOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay key ID from environment variables
        currency: "INR",
        name: "DineDesk POS",
        description: "Restaurant Management System Subscription",
        image: "/favicon.ico", // Your logo
        theme: {
          color: "#cc6600",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed by user");
          },
        },
      };

      const paymentOptions = { ...defaultOptions, ...options };

      console.log("Final payment options:", paymentOptions);
      console.log("Razorpay Key ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      const razorpayInstance = new Razorpay(paymentOptions);

      // Open payment popup
      console.log("Opening Razorpay popup...");
      razorpayInstance.open();

      return razorpayInstance;
    } catch (error) {
      console.error("Error initializing Razorpay payment:", error);
      throw error;
    }
  }

  // Create subscription payment
  async createSubscriptionPayment(planDetails) {
    const { planName, amount, isYearly, email, phone, name } = planDetails;

    const paymentOptions = {
      amount: amount * 100, // Amount in paise (multiply by 100)
      description: `${planName} Plan - ${
        isYearly ? "Yearly" : "Monthly"
      } Subscription`,
      prefill: {
        name: name || "",
        email: email || "",
        contact: phone || "",
      },
      notes: {
        plan: planName,
        billing_cycle: isYearly ? "yearly" : "monthly",
      },
      handler: function (response) {
        // This function will be called when payment is successful
        console.log("Payment successful:", response);

        // You can handle successful payment here
        // Send payment details to your backend for verification
        handlePaymentSuccess(response, planDetails);
      },
    };

    return await this.initializePayment(paymentOptions);
  }

  // Verify payment with backend
  async verifyPayment(paymentData) {
    try {
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  }
}

// Handle successful payment
async function handlePaymentSuccess(response, planDetails) {
  try {
    console.log("Processing successful payment...", response);

    // Show success message
    alert(`Payment successful! Welcome to ${planDetails.planName} plan.`);

    // You can add additional logic here such as:
    // - Redirecting to dashboard
    // - Updating user subscription status
    // - Sending confirmation email

    // Example: Redirect to dashboard after successful payment
    window.location.href = "/dashboard";

    // Or call a function to update the UI
    // updateSubscriptionStatus(planDetails);
  } catch (error) {
    console.error("Error handling payment success:", error);
    alert(
      "Payment was successful but there was an error processing your subscription. Please contact support."
    );
  }
}

// Handle payment failure
function handlePaymentFailure(error) {
  console.error("Payment failed:", error);
  alert(
    "Payment failed. Please try again or contact support if the problem persists."
  );
}

// Create singleton instance
const razorpayService = new RazorpayService();

export default razorpayService;

// Export utility functions
export { handlePaymentSuccess, handlePaymentFailure };
