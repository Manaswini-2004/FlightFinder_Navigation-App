import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "../assets/logo.png"; // Make sure this path is correct

export const generateETicket = ({ booking, selectedSeats = [] }) => {
  const doc = new jsPDF();

  const {
    flight = {},
    passengers = [],
    travelClass = "Economy",
    status = "Confirmed",
  } = booking || {};
const email = booking?.formData?.email || booking?.email || "N/A"; 
  const qrData = `
Passengers: ${passengers.map((p, i) => `${i + 1}. ${p.name} (${p.age}, ${p.gender})`).join("\n")}
Email: ${email}
Flight: ${flight?.airline} (${flight?.from} → ${flight?.to})
Date: ${flight?.date}
Seats: ${selectedSeats.join(", ") || "Not Assigned"}
Status: ${status}
  `;

  QRCode.toDataURL(qrData).then((qrImage) => {
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SB FlightFinder E-Ticket", 10, 14);

    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, 'PNG', 170, 3, 30, 14);
      doc.addImage(qrImage, "PNG", 165, 30, 30, 30);

      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      doc.setDrawColor(150);
      doc.roundedRect(10, 25, 190, 155, 5, 5);

      let y = 35;

      // Passenger Info
      doc.setFont("helvetica", "bold");
      doc.text(" Passenger Details", 15, y);
      y += 8;
      doc.setFont("helvetica", "normal");

      passengers.forEach((p, i) => {
        doc.text(`${i + 1}. ${p.name}, ${p.age} yrs, ${p.gender}`, 15, y);
        y += 7;
      });

      // Flight Info
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(" Flight Information", 15, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.text(`Airline: ${flight?.airline || "N/A"}`, 15, y);
      y += 7;
      doc.text(`From: ${flight?.from || "?"}`, 15, y);
      y += 7;
      doc.text(`To: ${flight?.to || "?"}`, 15, y);
      y += 7;
      doc.text(`Date: ${flight?.date ? new Date(flight.date).toLocaleDateString() : "N/A"}`, 15, y);
      y += 7;
      doc.text(`Departure Time: ${flight?.departureTime || "N/A"}`, 15, y);
      y += 7;
      doc.text(`Arrival Time: ${flight?.arrivalTime || "N/A"}`, 15, y);

      // Booking Info
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text(" Booking Details", 15, y);
      y += 8;
      doc.setFont("helvetica", "normal");
doc.text(`Email: ${email}`, 15, y);
      y += 7;
      doc.text(`Class: ${travelClass || "Economy"}`, 15, y);
      y += 7;
      doc.text(`Seats Booked: ${passengers.length}`, 15, y);
      y += 7;
doc.text(`Seat Numbers: ${booking?.selectedSeats?.join(", ") || "Not Assigned"}`, 15, y);
      y += 7;
      doc.text(`Booking Status: ${status || "Confirmed"}`, 15, y);

      // Terms & Conditions
      doc.setFontSize(9);
      doc.setTextColor(90);
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions:", 15, 205);
      doc.setFont("helvetica", "normal");
      doc.text("1. Please carry a valid government ID along with this ticket.", 15, 210);
      doc.text("2. Boarding gates close 20 minutes before departure.", 15, 215);
      doc.text("3. E-ticket is non-transferable and valid only for the booked flight.", 15, 220);

      // Refund Policy
      doc.setFont("helvetica", "bold");
      doc.text("Refund Policy:", 15, 228);
      doc.setFont("helvetica", "normal");
      doc.text("• Full refund available for cancellations within 24 hours of booking.", 15, 233);
      doc.text("• After 24 hours, partial refund may apply based on airline rules.", 15, 238);
      doc.text("• Refunds are processed within 7–10 business days.", 15, 243);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Thank you for booking with FlightFinder", 15, 280);
      doc.text("www.SBflightfinder.com | support@SBflightfinder.com", 15, 286);

      // Save PDF
      doc.save(`e-ticket-${Date.now()}.pdf`);
    };
  });
};
