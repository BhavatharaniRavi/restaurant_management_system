import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>The Spice Route</h3>
          <p>Luxury dining, curated comfort, and effortless delivery in one refined experience.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/restaurants">Order Food</Link></li>
            <li><Link to="/tables">Table Reservation</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/reservations">My Reservations</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>hello@thespiceroute.com</li>
            <li>+91 98765 43210</li>
            <li>Downtown, Hyderabad</li>
          </ul>
        </div>
      </div>
      <p className="footer-sub">© {new Date().getFullYear()} The Spice Route. Crafted for elegant cravings.</p>
    </footer>
  );
}
