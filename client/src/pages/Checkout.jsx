import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, restaurantId, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("takeaway");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);
    try {
      const orderPayload = {
        restaurantId,
        orderType,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      };
      const { data: orderData } = await api.post("/orders", orderPayload);
      const order = orderData.order;

      clearCart();
      navigate(`/orders/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-container narrow">
      <h1>Checkout</h1>
      <p className="muted">Confidently complete your order with secure payment and a polished delivery experience.</p>
      {error && <div className="alert-error">{error}</div>}

      <form className="card-form" onSubmit={handlePay}>
        <label>Order Type</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="orderType" value="takeaway" checked={orderType === "takeaway"} onChange={() => setOrderType("takeaway")} />
            Takeaway
          </label>
          <label>
            <input type="radio" name="orderType" value="dine-in" checked={orderType === "dine-in"} onChange={() => setOrderType("dine-in")} />
            Dine-in
          </label>
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>₹40</span>
          </div>
          <div className="summary-row total">
            <span>Amount Payable</span>
            <span>₹{totalAmount + 40}</span>
          </div>
        </div>

        <p className="muted small">
          Pay using your preferred UPI or digital wallet app from the final payment step on your device.
        </p>

        <button type="submit" className="btn-primary full" disabled={processing}>
          {processing ? "Placing Order..." : `Confirm Order ₹${totalAmount + 40}`}
        </button>
      </form>
    </div>
  );
}
