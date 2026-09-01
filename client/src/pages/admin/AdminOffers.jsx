import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function AdminOffers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ userId: "", message: "", type: "offer" });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/admin/customers").then(({ data }) => {
      setCustomers(data.customers);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess("");
    try {
      if (form.userId === "all") {
        await Promise.all(
          customers.map((c) => api.post("/notifications", { userId: c._id, message: form.message, type: form.type }))
        );
      } else {
        await api.post("/notifications", form);
      }
      setSuccess("Notification sent successfully.");
      setForm({ userId: "", message: "", type: "offer" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1>Offers &amp; Notifications</h1>
      <p className="muted">Send promotional offers or announcements to your customers.</p>
      {success && <div className="alert-success">{success}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <label>Recipient</label>
        <select name="userId" required value={form.userId} onChange={handleChange}>
          <option value="">-- Select recipient --</option>
          <option value="all">All Customers</option>
          {customers.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
        </select>

        <label>Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="offer">Promotional Offer</option>
          <option value="general">General Announcement</option>
        </select>

        <label>Message</label>
        <textarea name="message" rows={3} required value={form.message} onChange={handleChange} placeholder="e.g. Get 20% off this weekend!" />

        <button type="submit" className="btn-primary full" disabled={sending}>
          {sending ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
}
