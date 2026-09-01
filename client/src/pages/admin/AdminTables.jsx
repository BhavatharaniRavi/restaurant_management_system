import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function AdminTables() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: "", capacity: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/restaurants").then(({ data }) => {
      setRestaurants(data.restaurants);
      if (data.restaurants.length > 0) setRestaurantId(data.restaurants[0]._id);
      setLoading(false);
    });
  }, []);

  const loadTables = async (rid) => {
    if (!rid) return;
    const { data } = await api.get("/tables", { params: { restaurantId: rid } });
    setTables(data.tables);
  };

  useEffect(() => {
    loadTables(restaurantId);
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/tables", { restaurantId, tableNumber: Number(form.tableNumber), capacity: Number(form.capacity) });
    setForm({ tableNumber: "", capacity: "" });
    loadTables(restaurantId);
  };

  const updateStatus = async (table, status) => {
    await api.put(`/tables/${table._id}`, { status });
    loadTables(restaurantId);
  };

  const deleteTable = async (id) => {
    if (!window.confirm("Delete this table?")) return;
    await api.delete(`/tables/${id}`);
    loadTables(restaurantId);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Table Management</h1>

      <label>Restaurant</label>
      <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
        {restaurants.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
      </select>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input placeholder="Table number" type="number" required value={form.tableNumber}
          onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} />
        <input placeholder="Capacity" type="number" required value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
        <button type="submit" className="btn-primary">Add Table</button>
      </form>

      <table className="admin-table">
        <thead><tr><th>Table No.</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {tables.map((t) => (
            <tr key={t._id}>
              <td>{t.tableNumber}</td>
              <td>{t.capacity}</td>
              <td><span className={`badge status-${t.status}`}>{t.status}</span></td>
              <td>
                <select value={t.status} onChange={(e) => updateStatus(t, e.target.value)}>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="occupied">Occupied</option>
                </select>
                <button className="link-btn danger" onClick={() => deleteTable(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
