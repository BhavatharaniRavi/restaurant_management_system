import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const STATUS_OPTIONS = ["placed", "preparing", "ready", "served", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    const { data } = await api.get("/orders");
    setOrders(data.orders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Order Management</h1>

      <div className="category-tabs">
        {["all", ...STATUS_OPTIONS].map((f) => (
          <button key={f} className={filter === f ? "tab active" : "tab"} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Type</th><th>Amount</th><th>Payment</th><th>Status</th><th>Update</th></tr>
        </thead>
        <tbody>
          {filtered.map((o) => (
            <tr key={o._id}>
              <td>#{o._id.slice(-6).toUpperCase()}</td>
              <td>{o.userId?.name}</td>
              <td>{o.orderType}</td>
              <td>₹{o.totalAmount}</td>
              <td>{o.paymentStatus}</td>
              <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
