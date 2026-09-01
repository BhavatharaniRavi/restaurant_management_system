import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

export default function AdminReports() {
  const [sales, setSales] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const load = async (d) => {
    setLoading(true);
    const [salesRes, popularRes] = await Promise.all([
      api.get("/admin/reports/sales", { params: { days: d } }),
      api.get("/admin/reports/popular-items"),
    ]);
    setSales(salesRes.data.report);
    setPopularItems(popularRes.data.items);
    setLoading(false);
  };

  useEffect(() => {
    load(days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDaysChange = (d) => {
    setDays(d);
    load(d);
  };

  if (loading) return <Loader />;

  const maxRevenue = Math.max(...sales.map((s) => s.revenue), 1);

  return (
    <div>
      <h1>Reports</h1>

      <h3>Sales — Last {days} Days</h3>
      <div className="category-tabs">
        {[7, 14, 30].map((d) => (
          <button key={d} className={days === d ? "tab active" : "tab"} onClick={() => handleDaysChange(d)}>
            {d} days
          </button>
        ))}
      </div>

      {sales.length === 0 ? (
        <p className="muted">No sales recorded in this period.</p>
      ) : (
        <div className="bar-chart">
          {sales.map((s) => (
            <div className="bar-row" key={s._id}>
              <span className="bar-label">{s._id}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(s.revenue / maxRevenue) * 100}%` }} />
              </div>
              <span className="bar-value">₹{s.revenue} ({s.orders} orders)</span>
            </div>
          ))}
        </div>
      )}

      <h3>Most Popular Menu Items</h3>
      <table className="admin-table">
        <thead><tr><th>Item</th><th>Quantity Sold</th><th>Revenue</th></tr></thead>
        <tbody>
          {popularItems.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.totalQuantity}</td>
              <td>₹{item.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
