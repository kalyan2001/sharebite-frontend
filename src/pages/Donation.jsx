import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { generateDonationReceipt } from "../utils/generateReceipt";

const PRESETS = ["5.00", "10.00", "25.00", "50.00"];

function Donation() {
  const [amount, setAmount] = useState("10.00");
  const [donorName, setDonorName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showReceiptButton, setShowReceiptButton] = useState(false);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const user = JSON.parse(localStorage.getItem("user"));

  // HANDLE PDF DOWNLOAD
  const downloadReceipt = () => {
    
    generateDonationReceipt({
      donorName: user?.name || "Anonymous Donor",
      donorEmail: user?.email || "Not Provided",
      amount,
      transactionId,
      orderId,
      date: new Date().toLocaleString(),
    });
  };

  return (
    <>
      <Navbar />

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg p-4">
              <h1 className="text-center text-primary mb-3">
                💙 Support ShareBite
              </h1>

              <p className="text-center text-muted">
                Your donation helps us run food distribution, logistics, and
                emergency support.
                <br />
                <strong>Secure PayPal Payment (CAD)</strong>
              </p>

              {/* Donation Preset Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                {PRESETS.map((v) => (
                  <button
                    key={v}
                    className={`btn ${
                      amount === v ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setAmount(v)}
                  >
                    ${v}
                  </button>
                ))}

                <input
                  type="number"
                  aria-label="Enter custom donation amount"
                  min="1"
                  step="0.01"
                  className="form-control"
                  style={{ width: "120px" }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Custom"
                />
              </div>

              {/* PayPal Button */}
              <PayPalScriptProvider
                options={{ "client-id": clientId, currency: "CAD" }}
              >
                <PayPalButtons
                  fundingSource="paypal"
                  style={{ layout: "vertical", shape: "rect" }}
                  createOrder={async () => {
                    const { data } = await axios.post(
                      "http://localhost:5000/api/payments/create-order",
                      { amount }
                    );
                    return data.id;
                  }}
                  onApprove={async (data) => {
                    try {
                      const res = await axios.post(
                        "http://localhost:5000/api/payments/capture-order",
                        { orderId: data.orderID }
                      );

                      // Extract values for the receipt
                      const payerName =
                        res.data.capture?.payer?.name?.given_name || "Donor";
                      const txnId =
                        res.data.capture?.purchase_units?.[0]?.payments
                          ?.captures?.[0]?.id || "N/A";

                      setDonorName(payerName);
                      setTransactionId(txnId);
                      setOrderId(data.orderID);
                      setShowReceiptButton(true);

                      toast.success(
                        `Thank you, ${payerName}! You donated $${amount}.`
                      );
                    } catch (err) {
                      console.error(err);
                      toast.error("Payment capture failed.");
                    }
                  }}
                  onCancel={() => toast.warning("Payment cancelled.")}
                  onError={() => toast.error("Something went wrong.")}
                />
              </PayPalScriptProvider>

              {/* Download Receipt Button */}
              {showReceiptButton && (
                <button
                  className="btn btn-outline-success w-100 mt-3"
                  onClick={downloadReceipt}
                >
                  📄 Download Donation Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <ToastContainer />
      <Footer />
    </>
  );
}

export default Donation;
