import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!user || user.role !== "customer") {
      navigate("/login", { replace: false, state: { from: window.location.pathname } });
      return;
    }

    addItem(item, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={`menu-item-card ${!item.available ? "unavailable" : ""}`}>
      <div className="menu-item-info">
        <div className="menu-item-title">
          <span className={`veg-dot ${item.isVeg ? "veg" : "non-veg"}`} title={item.isVeg ? "Veg" : "Non-Veg"} />
          <h4>{item.name}</h4>
        </div>
        <p className="muted small">{item.description}</p>
        <p className="price">₹{item.price}</p>
      </div>
      <button className="btn-add" onClick={handleAdd} disabled={!item.available}>
        {!item.available ? "Unavailable" : added ? "Added ✓" : user && user.role === "customer" ? "Add to Cart" : "Login to Order"}
      </button>
    </div>
  );
}
