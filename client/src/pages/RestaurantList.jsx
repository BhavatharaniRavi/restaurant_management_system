import { useEffect, useState } from "react";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurantCard";
import Loader from "../components/Loader";

const sampleRestaurants = [
  { _id: "1", name: "Spice Garden", cuisine: "South Indian", rating: 4.8, deliveryTime: "25 mins", distance: "1.2 km", minOrder: "$15" },
  { _id: "2", name: "Royal Biryani House", cuisine: "Biryani", rating: 4.7, deliveryTime: "30 mins", distance: "2.0 km", minOrder: "$18" },
  { _id: "3", name: "Italian Delight", cuisine: "Pizza & Pasta", rating: 4.6, deliveryTime: "35 mins", distance: "1.8 km", minOrder: "$20" },
  { _id: "4", name: "Burger Hub", cuisine: "Fast Food", rating: 4.5, deliveryTime: "20 mins", distance: "0.9 km", minOrder: "$12" },
  { _id: "5", name: "Chinese Wok", cuisine: "Chinese", rating: 4.4, deliveryTime: "28 mins", distance: "1.6 km", minOrder: "$16" },
  { _id: "6", name: "BBQ Nation", cuisine: "Grill", rating: 4.9, deliveryTime: "40 mins", distance: "3.0 km", minOrder: "$22" },
];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/restaurants", { params: query ? { search: query } : {} });
      if (data.restaurants?.length) {
        setRestaurants(data.restaurants);
      } else {
        setRestaurants(sampleRestaurants.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.cuisine.toLowerCase().includes(query.toLowerCase())));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load restaurants");
      setRestaurants(sampleRestaurants);
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
        <p className="muted">Search your favorite cuisine, compare ratings, and enjoy premium delivery experiences.</p>
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
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Loader />
      ) : restaurants.length === 0 ? (
        <p className="muted">No restaurants found.</p>
      ) : (
        <div className="grid-cards">
          {restaurants.map((r) => (
            <RestaurantCard key={r._id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
}
