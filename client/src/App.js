import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import FlightSearch from './components/Flights/FlightSearch';
import FlightBooking from './components/Flights/FlightBooking';
import UserBookings from './components/Flights/UserBookings';
import Dashboard from './components/Admin/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddFlight from './components/Admin/AddFlight';
import UpdateFlight from './components/Admin/UpdateFlight';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import SelectSeats from './components/SelectSeats';
import PaymentPage from './components/PaymentPage'; // Import PaymentPage
import AdminFlights from "./components/Admin/AdminFlights";
import AdminBookings from "./components/Admin/AdminBookings";
import AdminUsers from "./components/Admin/AdminUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flights" element={<FlightSearch />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/select-seats" element={<SelectSeats />} />

        <Route path="/book/:id" element={<FlightBooking />} />
        <Route path="/my-bookings" element={<UserBookings />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/flights" element={<AdminFlights />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add" element={<AddFlight />} />
        <Route path="/admin/update" element={<UpdateFlight />} />
        <Route path="/payment" element={<PaymentPage />} /> {/* ✅ Add this */}
      </Routes>
    </Router>
  );
}

export default App;
