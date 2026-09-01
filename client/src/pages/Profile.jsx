import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || "", address: user.address || "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container narrow">
      <h1>My Profile</h1>
      {message && <div className="alert-success">{message}</div>}
      {error && <div className="alert-error">{error}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <label>Email (cannot be changed)</label>
        <input type="email" value={user.email} disabled />

        <label>Full Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Phone</label>
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} />

        <label>Address</label>
        <textarea name="address" rows={3} value={form.address} onChange={handleChange} />

        <button type="submit" className="btn-primary full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
