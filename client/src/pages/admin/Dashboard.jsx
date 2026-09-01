import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard").then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: "Total Orders", value: stats.totalOrders },
    { label: "Total Revenue", value: `₹${stats.totalRevenue}` },
    { label: "Total Reservations", value: stats.totalReservations },
    { label: "Total Customers", value: stats.totalCustomers },
    { label: "Active Restaurants", value: stats.totalRestaurants },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Pending Reservations", value: stats.pendingReservations },
  ];

  return (
    <div>
      <div className="page-intro">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Luxury operations dashboard</h1>
        </div>
        <p className="muted">Monitor reservations, orders, customer activity, and revenue in one premium workspace.</p>
      </div>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="section-block" style={{ marginTop: 16 }}>
        <p className="eyebrow">Live focus</p>
        <h3>Key initiatives</h3>
        <p className="muted">Drive early reservations, keep service quality high, and maintain strong order velocity during peak hours.</p>
      </div>
    </div>
  );
}
