import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const publicItems = [
  { label: "Home", to: "/", end: true },
  { label: "Food", to: "/restaurants" },
  { label: "Restaurants", to: "/restaurants" },
];

const customerItems = [
  { label: "Home", to: "/", end: true },
  { label: "Order Food", to: "/restaurants" },
  { label: "Book Table", to: "/tables" },
  { label: "My Reservation", to: "/reservations" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  const cartLinkClass = ({ isActive }) => (isActive ? "cart-link nav-link active" : "cart-link nav-link");

  const menuItems = user?.role === "admin" ? [] : user && user.role === "customer" ? customerItems : publicItems;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">SR</span>
          <span className="brand-text">
            <span className="brand-name">Spice Route</span>
            <span className="brand-tag">Food • Table Booking</span>
          </span>
        </Link>

        <div className="location-pill">
          <span className="location-pin">📍</span>
          <span>Coimbatore</span>
        </div>

        <nav className="nav-links">
          {menuItems.map((item) => (
            <NavLink key={item.label} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}

          {user?.role === "admin" ? (
            <>
              <NavLink to="/admin" className={linkClass}>Dashboard</NavLink>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : user && user.role === "customer" ? (
            <>
              <NavLink to="/cart" className={cartLinkClass}>
                Cart{totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </NavLink>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <Link to="/register" className="btn-outline-nav">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
