// Simple test to debug the login endpoint
const testLogin = async () => {
  const testData = {
    email: "test@example.com",
    password: "Test123456",
  };

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("Response data:", data);
  } catch (error) {
    console.error("Request failed:", error);
  }
};

testLogin();
