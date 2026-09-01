import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="page-container narrow center">
        <h1>Your Cart is Empty</h1>
        <p className="muted">Browse restaurants and add some delicious food to get started.</p>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="page-container narrow">
      <h1>Your Cart</h1>
      <p className="muted">Elegant dishes, prepared for pickup or delivery, are ready for checkout.</p>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-row" key={item.menuItemId}>
            <div>
              <h4>{item.name}</h4>
              <p className="muted small">₹{item.price} each</p>
            </div>
            <div className="qty-control">
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}>+</button>
            </div>
            <p className="line-total">₹{item.price * item.quantity}</p>
            <button className="link-btn danger" onClick={() => removeItem(item.menuItemId)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
        <div className="summary-row">
          <span>Delivery</span>
          <span>₹40</span>
        </div>
        <div className="summary-row">
          <span>Service fee</span>
          <span>₹25</span>
        </div>
        <div className="summary-row total">
          <span>Grand Total</span>
          <span>₹{totalAmount + 65}</span>
        </div>
        <button className="btn-primary full" onClick={handleCheckout}>Proceed to Checkout</button>
        <button className="link-btn" onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}
