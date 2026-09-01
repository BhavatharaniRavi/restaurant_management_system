import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import StarRating from "../components/StarRating";

const sampleRestaurants = [
  { _id: "1", name: "Spice Garden", cuisine: "South Indian", rating: 4.8, address: "12 MG Road, Coimbatore" },
  { _id: "2", name: "Royal Biryani House", cuisine: "Biryani", rating: 4.7, address: "45 Race Course Road, Coimbatore" },
  { _id: "3", name: "Italian Delight", cuisine: "Pizza & Pasta", rating: 4.6, address: "8 Avinashi Road, Coimbatore" },
  { _id: "4", name: "Burger Hub", cuisine: "Fast Food", rating: 4.5, address: "21 RS Puram, Coimbatore" },
  { _id: "5", name: "Chinese Wok", cuisine: "Chinese", rating: 4.4, address: "3 Gandhipuram, Coimbatore" },
  { _id: "6", name: "BBQ Nation", cuisine: "Grill", rating: 4.9, address: "17 Peelamedu, Coimbatore" },
];

export default function TableReservation() {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [restRes, tableRes] = await Promise.all([
          api.get("/restaurants"),
          api.get("/tables"),
        ]);
        setRestaurants(restRes.data.restaurants?.length ? restRes.data.restaurants : sampleRestaurants);
        setTables(tableRes.data.tables || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load restaurants and tables");
        setRestaurants(sampleRestaurants);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(restaurants.map((r) => r.cuisine).filter(Boolean)));
    return ["All", ...unique];
  }, [restaurants]);

  const tablesByRestaurant = useMemo(() => {
    const map = {};
    tables.forEach((t) => {
      const key = typeof t.restaurantId === "object" ? t.restaurantId?._id : t.restaurantId;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tables]);

  const filteredRestaurants = restaurants.filter((r) => {
    const cuisine = (r.cuisine || "").toLowerCase();
    const cat = category.toLowerCase();
    const matchesCategory = category === "All" || cuisine.includes(cat) || cat.includes(cuisine);
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      r.name.toLowerCase().includes(query) ||
      (r.cuisine || "").toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Table Reservation</p>
          <h1>Find and reserve a table</h1>
        </div>
        <p className="muted">Search by restaurant category, check live table availability, and reserve in a few clicks.</p>
      </div>

      <form className="search-panel" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search restaurant or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="category-tabs">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? "tab active" : "tab"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : filteredRestaurants.length === 0 ? (
        <p className="muted">No restaurants found for this category.</p>
      ) : (
        <div className="grid-cards">
          {filteredRestaurants.map((r) => {
            const restaurantTables = tablesByRestaurant[r._id] || [];
            const availableCount = restaurantTables.filter((t) => t.status === "available").length;

            return (
              <div key={r._id} className="tr-card">
                <div className="card-top-row">
                  <h3>{r.name}</h3>
                  <span className="status-pill">{r.cuisine || "Multi-Cuisine"}</span>
                </div>
                <StarRating value={r.rating || 0} />
                <p className="muted small">{r.address}</p>

                <div className="tr-table-info">
                  {restaurantTables.length === 0 ? (
                    <span className="meta-chip">Table info unavailable</span>
                  ) : (
                    <>
                      <span className="meta-chip">{restaurantTables.length} tables</span>
                      <span className={availableCount > 0 ? "status-pill" : "meta-chip"}>
                        {availableCount > 0 ? `${availableCount} available now` : "Fully booked"}
                      </span>
                    </>
                  )}
                </div>

                <div className="tr-card-actions">
                  <Link to={`/restaurants/${r._id}`} className="btn-outline">View Menu</Link>
                  <Link to={`/restaurants/${r._id}/reserve`} className="btn-primary">Reserve Table</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
