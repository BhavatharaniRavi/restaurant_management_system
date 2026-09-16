import { useEffect, useState } from "react";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/restaurants", {
        params: query ? { search: query } : {},
      });

      if (data.restaurants?.length) {
        setRestaurants(data.restaurants);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error("Failed to load restaurants:", err);

      setError(
        err.response?.data?.message || "Failed to load restaurants"
      );

      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <div className="page-container">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Curated dining</p>

          <h1>Discover premium restaurants near you</h1>
        </div>

        <p className="muted">
          Search your favorite cuisine, compare ratings, and enjoy premium
          delivery experiences.
        </p>
      </div>

      <div className="login-gate-banner">
        <span>Login to place orders and reserve tables.</span>
      </div>

      <form className="search-panel" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search restaurant, cuisine or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select defaultValue="All Cuisines">
          <option>All Cuisines</option>
          <option>South Indian</option>
          <option>Biryani</option>
          <option>Italian</option>
          <option>Fast Food</option>
        </select>

        <select defaultValue="Rating">
          <option>Rating</option>
          <option>4.5+</option>
          <option>4.7+</option>
          <option>4.9+</option>
        </select>

        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : restaurants.length === 0 ? (
        <p className="muted">No restaurants found.</p>
      ) : (
        <div className="grid-cards">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
            />
          ))}
        </div>
      )}
    </div>
  );
}