import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";

export default function ReservationsList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    try {
      const { data } = await api.get("/reservations");
      setReservations(data.reservations);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await api.put(`/reservations/${id}`, { status: "cancelled" });
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel reservation");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="page-container">
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <p className="muted">You have no reservations yet.</p>
      ) : (
        <div className="list-stack">
          {reservations.map((r) => (
            <div className="list-card" key={r._id}>
              <div className="list-card-row">
                <div>
                  <h4>{r.restaurantId?.name}</h4>
                  <p className="muted small">
                    Table {r.tableId?.tableNumber} · {r.guests} guests ·{" "}
                    {new Date(r.dateTime).toLocaleString()}
                  </p>
                </div>
                <span className={`badge status-${r.status}`}>{r.status}</span>
              </div>
              {r.specialRequest && <p className="muted small">Note: {r.specialRequest}</p>}
              {(r.status === "pending" || r.status === "confirmed") && (
                <button className="link-btn danger" onClick={() => cancelReservation(r._id)}>
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
