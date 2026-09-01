import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

const STATUS_STEPS = ["placed", "preparing", "ready", "served", "delivered"];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // poll every 10s for live-ish tracking
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="alert-error">{error}</div>;
  if (!order) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="page-container narrow">
      <h1>Order #{order._id.slice(-6).toUpperCase()}</h1>
      <p className="muted">{order.restaurantId?.name} · {order.orderType}</p>

      {order.status === "cancelled" ? (
        <div className="alert-error">This order has been cancelled.</div>
      ) : (
        <div className="status-tracker">
          {STATUS_STEPS.map((step, idx) => (
            <div key={step} className={`status-step ${idx <= currentStepIndex ? "done" : ""}`}>
              <div className="status-dot" />
              <span>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="order-items">
        <h3>Items</h3>
        {order.items.map((it) => (
          <div className="order-item-row" key={it.menuItemId}>
            <span>{it.name} × {it.quantity}</span>
            <span>₹{it.price * it.quantity}</span>
          </div>
        ))}
        <div className="order-item-row total">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <p className="muted small">Payment status: {order.paymentStatus}</p>
      </div>

      <Link to="/orders" className="btn-outline">Back to My Orders</Link>
    </div>
  );
}
