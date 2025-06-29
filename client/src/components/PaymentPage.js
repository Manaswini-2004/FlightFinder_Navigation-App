import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Lottie from "lottie-react";
import successAnimation from "../animations/success.json";
import { generateETicket } from "../utils/generateETicket";
import "./PaymentPage.css";

const stripePromise = loadStripe("pk_test_51RbbXCR0RIDPyXYkAbaEJj8us4oeE2PcjH7EeNObjPregi2Xegm2jDAM4GYpg68VAXd9fBFLXqVhoJpmROmnuMKU00NLbQqhrn");

const PaymentPage = () => {
  const { state, search } = useLocation();
  const {
    flight,
    returnFlight,
    formData,
    selectedSeats = [],
    returnSelectedSeats = [],
    travelClass,
    isRoundTrip,
  } = state || {};

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const baseClass = travelClass || "Economy";

  useEffect(() => {
    const query = new URLSearchParams(search);
    const bookingId = query.get("bookingId");

    if (query.get("success") === "true") {
      setPaymentSuccess(true);

      // Confirm booking status on backend
      if (bookingId) {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api/bookings/confirm/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => console.log("Booking confirmed:", data))
          .catch(err => console.error("Error confirming booking:", err));
      }

      // Generate departure and return tickets
      if (flight && formData) {
        generateETicket({
          booking: {
            flight,
            formData,
            passengers: formData.passengers || [],
            travelClass: baseClass,
            status: "Confirmed",
          },
          selectedSeats,
        });

        if (isRoundTrip && returnFlight) {
          generateETicket({
            booking: {
              flight: returnFlight,
              formData,
              passengers: formData.passengers || [],
              travelClass: baseClass,
              status: "Confirmed",
            },
            selectedSeats: returnSelectedSeats,
          });
        }
      }
    }
  }, [search, flight, formData, baseClass, selectedSeats, returnFlight, returnSelectedSeats, isRoundTrip]);

  const getAdjustedPrice = (flightData) => {
    if (!flightData) return 0;
    const basePrice = flightData.price;
    const classMultiplier =
      baseClass === "Business" ? 1.3 :
      baseClass === "First Class" ? 1.6 : 1;
    const total = basePrice * formData.seats * classMultiplier;
    return Math.round(total);
  };

  const totalAmount = getAdjustedPrice(flight) + (isRoundTrip ? getAdjustedPrice(returnFlight) : 0);

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.userId;

      // 1. Create pending booking before redirecting to Stripe
      const pendingRes = await fetch("http://localhost:5000/api/bookings/pending", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          flight,
          returnFlight,
          formData,
          travelClass: baseClass,
          selectedSeats,
          returnSelectedSeats,
        }),
      });

      const pendingData = await pendingRes.json();
      const bookingId = pendingData.bookingId;

      if (!bookingId) {
        alert("Failed to create booking. Try again.");
        return;
      }

      // 2. Create Stripe session
      const response = await fetch("http://localhost:5000/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          flight,
          returnFlight,
          formData,
          userId,
          travelClass: baseClass,
          totalAmount,
          selectedSeats,
          returnSelectedSeats,
          bookingId, // send to success URL
        }),
      });

      const session = await response.json();

      if (!session.id) {
        alert("Failed to create Stripe session.");
        return;
      }

      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Stripe error:", error);
      alert("Payment processing error.");
    }
  };

  return (
    <div className="payment-container">
      {paymentSuccess ? (
        <>
          <Lottie animationData={successAnimation} style={{ height: 200 }} />
          <h2>🎉 Payment Successful!</h2>
          <p>Your e-ticket{isRoundTrip ? "s have" : " has"} been downloaded. Check your downloads folder.</p>

          {/* Navigation Buttons */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="pay-btn" onClick={() => window.location.href = "/my-bookings"}>
              📄 Go to My Bookings
            </button>
            <button className="pay-btn" onClick={() => window.location.href = "/dashboard"}>
              🏠 Go to Dashboard
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>💳 Confirm Payment</h2>

          <div className="payment-details">
            <p><strong>Email:</strong> {formData?.email}</p>

            {/* Departure Flight */}
            <h3>Departure Flight</h3>
            <p><strong>Flight:</strong> {flight?.airline} ({flight?.from} → {flight?.to})</p>
            <p><strong>Date:</strong> {flight?.date}</p>
            <p><strong>Departure:</strong> {flight?.departureTime}</p>
            <p><strong>Arrival:</strong> {flight?.arrivalTime}</p>
            <p><strong>Seats:</strong> {formData?.seats}</p>
            <p><strong>Seats Booked:</strong> {selectedSeats?.join(", ") || "None"}</p>
            <p><strong>Class:</strong> {baseClass}</p>
            <p><strong>Price:</strong> ₹{getAdjustedPrice(flight)}</p>

            {/* Return Flight */}
            {isRoundTrip && returnFlight && (
              <>
                <h3>Return Flight</h3>
                <p><strong>Flight:</strong> {returnFlight?.airline} ({returnFlight?.from} → {returnFlight?.to})</p>
                <p><strong>Date:</strong> {returnFlight?.date}</p>
                <p><strong>Departure:</strong> {returnFlight?.departureTime}</p>
                <p><strong>Arrival:</strong> {returnFlight?.arrivalTime}</p>
                <p><strong>Seats:</strong> {formData?.seats}</p>
                <p><strong>Seats Booked:</strong> {returnSelectedSeats?.join(", ") || "None"}</p>
                <p><strong>Class:</strong> {baseClass}</p>
                <p><strong>Price:</strong> ₹{getAdjustedPrice(returnFlight)}</p>
              </>
            )}

            <hr />
            <h3>Total Payment: ₹{totalAmount}</h3>
          </div>

          <button className="pay-btn" onClick={handlePayment}>🧾 Pay Now</button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
