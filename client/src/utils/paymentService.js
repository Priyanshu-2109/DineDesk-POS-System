class PaymentService {
  constructor() {
    this.API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    this.RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
  }

  // Get subscription plans from backend
  async getPlans() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payment/plans`);
      const data = await response.json();

      if (data.success) {
        return { success: true, plans: data.plans };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Get plans error:", error);
      return { success: false, message: "Failed to fetch subscription plans" };
    }
  }

  // Create Razorpay order
  async createOrder(plan, token) {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();

      if (data.success) {
        return { success: true, order: data.order };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Create order error:", error);
      return { success: false, message: "Failed to create payment order" };
    }
  }

  // Verify payment and update subscription
  async verifyPayment(paymentData, token) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.user, payment: data.payment };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      return { success: false, message: "Failed to verify payment" };
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(plan, userDetails, token) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create order on backend
        const orderResult = await this.createOrder(plan, token);

        if (!orderResult.success) {
          reject(new Error(orderResult.message));
          return;
        }

        const order = orderResult.order;

        // Initialize Razorpay
        const options = {
          key: this.RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "DineDesk POS",
          description: `${order.planName} Subscription`,
          order_id: order.id,
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone || "",
          },
          notes: {
            plan: plan,
            planName: order.planName,
          },
          theme: {
            color: "#cc6600",
          },
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan,
              };

              const verifyResult = await this.verifyPayment(
                verificationData,
                token
              );

              if (verifyResult.success) {
                resolve({
                  success: true,
                  payment: response,
                  user: verifyResult.user,
                  message:
                    "Payment successful! Your subscription has been activated.",
                });
              } else {
                reject(
                  new Error(
                    verifyResult.message || "Payment verification failed"
                  )
                );
              }
            } catch (error) {
              reject(error);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled by user"));
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        reject(error);
      }
    });
  }
}

const paymentService = new PaymentService();
export default paymentService;
