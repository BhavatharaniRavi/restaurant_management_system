import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const submitReview = async (order) => {
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        restaurantId: order.restaurantId._id,
        orderId: order._id,
        rating,
        comment,
      });
      setReviewingId(null);
      setComment("");
      setRating(5);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="page-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p className="muted">You haven't placed any orders yet.</p>
      ) : (
        <div className="list-stack">
          {orders.map((order) => (
            <div className="list-card" key={order._id}>
              <div className="list-card-row">
                <div>
                  <h4>{order.restaurantId?.name}</h4>
                  <p className="muted small">
                    Order #{order._id.slice(-6).toUpperCase()} · {order.orderType} ·{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`badge status-${order.status}`}>{order.status}</span>
              </div>
              <p>₹{order.totalAmount} · Payment: {order.paymentStatus}</p>
              <div className="list-card-actions">
                <Link to={`/orders/${order._id}`} className="btn-outline small">Track Order</Link>
                {(order.status === "served" || order.status === "delivered") && (
                  <button className="btn-outline small" onClick={() => setReviewingId(order._id)}>
                    Rate & Review
                  </button>
                )}
              </div>

              {reviewingId === order._id && (
                <div className="review-box">
                  <label>Rating</label>
                  <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                  />
                  <div className="list-card-actions">
                    <button className="btn-primary small" disabled={submitting} onClick={() => submitReview(order)}>
                      Submit
                    </button>
                    <button className="link-btn" onClick={() => setReviewingId(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
