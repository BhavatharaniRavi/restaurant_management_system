import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchReservations = async () => {
    const { data } = await api.get("/reservations");
    setReservations(data.reservations);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/reservations/${id}`, { status });
    fetchReservations();
  };

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Reservation Management</h1>

      <div className="category-tabs">
        {["all", "pending", "confirmed", "cancelled", "completed"].map((f) => (
          <button key={f} className={filter === f ? "tab active" : "tab"} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr><th>Customer</th><th>Restaurant</th><th>Table</th><th>Date/Time</th><th>Guests</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id}>
              <td>{r.userId?.name}<br /><span className="muted small">{r.userId?.phone}</span></td>
              <td>{r.restaurantId?.name}</td>
              <td>{r.tableId?.tableNumber}</td>
              <td>{new Date(r.dateTime).toLocaleString()}</td>
              <td>{r.guests}</td>
              <td><span className={`badge status-${r.status}`}>{r.status}</span></td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button className="link-btn" onClick={() => updateStatus(r._id, "confirmed")}>Confirm</button>
                    <button className="link-btn danger" onClick={() => updateStatus(r._id, "cancelled")}>Cancel</button>
                  </>
                )}
                {r.status === "confirmed" && (
                  <button className="link-btn" onClick={() => updateStatus(r._id, "completed")}>Mark Completed</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
