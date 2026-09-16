import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import StarRating from "../components/StarRating";

export default function TableReservation() {
  const [searchParams] = useSearchParams();

  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [restRes, tableRes] = await Promise.all([
          api.get("/restaurants"),
          api.get("/tables"),
        ]);

        // Use ONLY real MongoDB restaurants
        setRestaurants(restRes.data.restaurants || []);
        setTables(tableRes.data.tables || []);
      } catch (err) {
        console.error(
          "Failed to load restaurants and tables:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load restaurants and tables"
        );

        // Do NOT use fake restaurant IDs
        setRestaurants([]);
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        restaurants
          .map((r) => r.cuisine)
          .filter(Boolean)
      )
    );

    return ["All", ...unique];
  }, [restaurants]);

  const tablesByRestaurant = useMemo(() => {
    const map = {};

    tables.forEach((t) => {
      const key =
        typeof t.restaurantId === "object"
          ? t.restaurantId?._id
          : t.restaurantId;

      if (!key) return;

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(t);
    });

    return map;
  }, [tables]);

  const filteredRestaurants = restaurants.filter((r) => {
    const cuisine = (r.cuisine || "").toLowerCase();
    const cat = category.toLowerCase();

    const matchesCategory =
      category === "All" ||
      cuisine.includes(cat) ||
      cat.includes(cuisine);

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      (r.name || "").toLowerCase().includes(query) ||
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

        <p className="muted">
          Search by restaurant category, check live table
          availability, and reserve in a few clicks.
        </p>
      </div>

      <form
        className="search-panel"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search restaurant or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="category-tabs">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={
              category === c
                ? "tab active"
                : "tab"
            }
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : filteredRestaurants.length === 0 ? (
        <p className="muted">
          No restaurants found for this category.
        </p>
      ) : (
        <div className="grid-cards">
          {filteredRestaurants.map((r) => {
            const restaurantTables =
              tablesByRestaurant[r._id] || [];

            const availableCount =
              restaurantTables.filter(
                (t) => t.status === "available"
              ).length;

            return (
              <div
                key={r._id}
                className="tr-card"
              >
                <div className="card-top-row">
                  <h3>{r.name}</h3>

                  <span className="status-pill">
                    {r.cuisine || "Multi-Cuisine"}
                  </span>
                </div>

                <StarRating
                  value={r.rating || 0}
                />

                <p className="muted small">
                  {r.address}
                </p>

                <div className="tr-table-info">
                  {restaurantTables.length === 0 ? (
                    <span className="meta-chip">
                      No tables available
                    </span>
                  ) : (
                    <>
                      <span className="meta-chip">
                        {restaurantTables.length} tables
                      </span>

                      <span
                        className={
                          availableCount > 0
                            ? "status-pill"
                            : "meta-chip"
                        }
                      >
                        {availableCount > 0
                          ? `${availableCount} available now`
                          : "Fully booked"}
                      </span>
                    </>
                  )}
                </div>

                <div className="tr-card-actions">
                  <Link
                    to={`/restaurants/${r._id}`}
                    className="btn-outline"
                  >
                    View Menu
                  </Link>

                  <Link
                    to={`/restaurants/${r._id}/reserve`}
                    className="btn-primary"
                  >
                    Reserve Table
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}