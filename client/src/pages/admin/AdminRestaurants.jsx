import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const emptyForm = { name: "", description: "", cuisine: "", address: "", imageUrl: "" };

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    const { data } = await api.get("/restaurants");
    setRestaurants(data.restaurants);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/restaurants/${editingId}`, form);
      } else {
        await api.post("/restaurants", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save restaurant");
    }
  };

  const handleEdit = (r) => {
    setForm({ name: r.name, description: r.description, cuisine: r.cuisine, address: r.address, imageUrl: r.imageUrl || "" });
    setEditingId(r._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this restaurant?")) return;
    await api.delete(`/restaurants/${id}`);
    fetchRestaurants();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Restaurant Management</h1>
      {error && <div className="alert-error">{error}</div>}

      <form className="inline-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Restaurant name" required value={form.name} onChange={handleChange} />
        <input name="cuisine" placeholder="Cuisine" value={form.cuisine} onChange={handleChange} />
        <input name="address" placeholder="Address" required value={form.address} onChange={handleChange} />
        <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={2} />
        <button type="submit" className="btn-primary">{editingId ? "Update" : "Add"} Restaurant</button>
        {editingId && <button type="button" className="link-btn" onClick={() => { setForm(emptyForm); setEditingId(null); }}>Cancel</button>}
      </form>

      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Cuisine</th><th>Address</th><th>Rating</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r._id}>
              <td>{r.name}</td>
              <td>{r.cuisine}</td>
              <td>{r.address}</td>
              <td>{r.rating?.toFixed(1)}</td>
              <td>
                <button className="link-btn" onClick={() => handleEdit(r)}>Edit</button>
                <button className="link-btn danger" onClick={() => handleDelete(r._id)}>Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
