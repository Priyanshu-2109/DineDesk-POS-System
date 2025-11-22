import jsPDF from "jspdf";

/**
 * Generate a professional PDF bill for a restaurant order
 * @param {Object} billData - Bill data including restaurant, order, and customer info
 * @returns {Blob} PDF blob for download or email
 */
export const generateBillPDF = (billData) => {
  const {
    restaurantName,
    tableName,
    orderItems,
    totalAmount,
    orderDate,
    customerEmail,
    orderNumber,
  } = billData;

  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header - Restaurant Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(restaurantName || "Restaurant", margin, 20);

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Order Receipt", margin, 30);

  // Divider Line
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);

  // Order Details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let yPos = 45;

  doc.text(`Order Number: ${orderNumber || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(`Table: ${tableName || "N/A"}`, margin, yPos);
  yPos += 7;
  doc.text(
    `Date: ${
      orderDate
        ? new Date(orderDate).toLocaleString()
        : new Date().toLocaleString()
    }`,
    margin,
    yPos
  );
  yPos += 7;
  if (customerEmail) {
    doc.text(`Customer Email: ${customerEmail}`, margin, yPos);
    yPos += 7;
  }

  // Divider
  yPos += 3;
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Items Header
  doc.setFont("helvetica", "bold");
  doc.text("Item", margin, yPos);
  doc.text("Qty", pageWidth - 80, yPos);
  doc.text("Price", pageWidth - 60, yPos);
  doc.text("Total", pageWidth - margin, yPos, { align: "right" });
  yPos += 5;

  // Divider
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;

  // Order Items
  doc.setFont("helvetica", "normal");
  orderItems.forEach((item) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(item.name, margin, yPos);
    doc.text(item.quantity.toString(), pageWidth - 80, yPos);
    doc.text(`₹${item.price}`, pageWidth - 60, yPos);
    doc.text(`₹${item.price * item.quantity}`, pageWidth - margin, yPos, {
      align: "right",
    });
    yPos += 7;
  });

  // Divider before total
  yPos += 3;
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Total Amount
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", margin, yPos);
  doc.text(`₹${totalAmount.toFixed(2)}`, pageWidth - margin, yPos, {
    align: "right",
  });

  // Footer
  yPos += 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const footerText = "Thank you for dining with us!";
  doc.text(footerText, pageWidth / 2, yPos, { align: "center" });

  yPos += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const poweredBy = "Powered by DineDesk POS System";
  doc.text(poweredBy, pageWidth / 2, yPos, { align: "center" });

  // Return PDF blob
  return doc.output("blob");
};

/**
 * Download PDF bill to user's device
 */
export const downloadBillPDF = (billData, filename) => {
  const pdfBlob = generateBillPDF(billData);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `Bill_${billData.orderNumber || Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Convert PDF blob to base64 for email sending
 */
export const pdfBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default {
  generateBillPDF,
  downloadBillPDF,
  pdfBlobToBase64,
};
