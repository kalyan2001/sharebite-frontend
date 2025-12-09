import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";

export function generateDonationReceipt({
  donorName = "Anonymous Donor",
  donorEmail = "Not Provided",
  amount = "0.00",
  transactionId = "N/A",
  orderId = "N/A",
  date = new Date().toLocaleString(),
}) {
  try {
    const doc = new jsPDF();

    // ======= REAL WATERMARK =======
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.setFontSize(60);
    doc.setTextColor(150);
    doc.text("ShareBite Canada", 20, 160, { angle: 45 });
    doc.restoreGraphicsState();

    // ======= HEADER WITH LOGO =======
    try {
      doc.addImage(logo, "PNG", 20, 10, 20, 20);
    } catch (err) {
      console.warn("⚠️ Logo failed to load:", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("SHAREBITE CANADA", 48, 23);

    doc.setDrawColor(37, 99, 235);
    doc.line(20, 35, 190, 35);

    // ===== Receipt ID =====
    const receiptId = `SB-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Receipt ID: ${receiptId}`, 20, 45);

    // ===== Donor Details Table =====
    autoTable(doc, {
      startY: 55,
      head: [["Donor Details", "Information"]],
      body: [
        ["Name", donorName],
        ["Email", donorEmail],
        ["Donation Date", date],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
      },
    });

    // ===== Donation Summary Table =====
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Donation Summary", ""]],
      body: [
        ["Donation Amount", `$${amount} CAD`],
        ["Transaction ID", transactionId],
        ["Order ID", orderId],
        ["Payment Method", "PayPal"],
      ],
      theme: "grid",
      styles: { fontSize: 11 },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
      },
    });

    // ===== Footer =====
    doc.setFontSize(13);
    doc.setTextColor(60, 60, 60);
    doc.text(
      "Thank you for supporting ShareBite and helping reduce food waste.",
      105,
      doc.lastAutoTable.finalY + 20,
      { align: "center" }
    );

    // Save PDF
    doc.save(`ShareBite_Receipt_${receiptId}.pdf`);
  } catch (err) {
    console.error("❌ PDF generation error:", err);
    alert("Failed to generate receipt.");
  }
}
