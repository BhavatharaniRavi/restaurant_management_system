import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function Reservation() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableId: "", date: "", time: "", guests: 2, specialRequest: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [restRes, tableRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get("/tables", { params: { restaurantId: id } }),
        ]);
        setRestaurant(restRes.data.restaurant);
        setTables(tableRes.data.tables);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load restaurant/table data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/restaurants/${id}/reserve` } });
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      await api.post("/reservations", {
        restaurantId: id,
        tableId: form.tableId,
        dateTime,
        guests: Number(form.guests),
        specialRequest: form.specialRequest,
      });
      setSuccess("Table reserved successfully! You can view it under 'My Reservations'.");
      setTimeout(() => navigate("/reservations"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reserve table");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  const suitableTables = tables.filter((t) => t.capacity >= Number(form.guests || 1));

  return (
    <div className="page-container narrow">
      <h1>Reserve a Table at {restaurant?.name}</h1>
      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <label>Number of Guests</label>
        <input type="number" name="guests" min={1} max={20} required value={form.guests} onChange={handleChange} />

        <label>Date</label>
        <input type="date" name="date" required value={form.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />

        <label>Time</label>
        <input type="time" name="time" required value={form.time} onChange={handleChange} />

        <label>Select Table</label>
        <select name="tableId" required value={form.tableId} onChange={handleChange}>
          <option value="">-- Choose a table --</option>
          {suitableTables.map((t) => (
            <option key={t._id} value={t._id}>
              Table {t.tableNumber} (Seats {t.capacity})
            </option>
          ))}
        </select>

        <label>Special Request (optional)</label>
        <textarea name="specialRequest" rows={3} value={form.specialRequest} onChange={handleChange} placeholder="e.g. Window seat, birthday celebration..." />

        <button type="submit" className="btn-primary full" disabled={submitting}>
          {submitting ? "Reserving..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
}
