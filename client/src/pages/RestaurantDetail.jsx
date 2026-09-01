import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import MenuItemCard from "../components/MenuItemCard";
import StarRating from "../components/StarRating";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const galleryFallbacks = [
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
];

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("restaurant");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [restRes, catRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get("/categories", { params: { restaurantId: id } }),
          api.get("/menu", { params: { restaurantId: id } }),
        ]);
        setRestaurant(restRes.data.restaurant);
        setCategories(catRes.data.categories);
        setItems(menuRes.data.items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.categoryId?._id === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <Loader />;
  if (error) return <div className="alert-error">{error}</div>;
  if (!restaurant) return null;

  const handleReserve = () => {
    if (!user || user.role !== "customer") {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    navigate(`/restaurants/${id}/reserve`);
  };

  const galleryImages = [
    restaurant.imageUrl || galleryFallbacks[0],
    galleryFallbacks[1],
    galleryFallbacks[2],
    galleryFallbacks[3],
  ];

  const roomDetails = [
    { title: "Dining Hall", description: "Warm lighting, premium seating, and elegant interiors for relaxed meals." },
    { title: "Private Rooms", description: "Intimate spaces for birthdays, family dinners, and business meetings." },
    { title: "Terrace Lounge", description: "Open-air seating with a scenic city view and cozy evening vibes." },
    { title: "Chef's Table", description: "Close-up dining experience with a front-row view of kitchen craftsmanship." },
  ];

  return (
    <div className="page-container">
      <div className="restaurant-header">
        <div>
          <p className="eyebrow">Signature dining</p>
          <h1>{restaurant.name}</h1>
          <p className="muted">{restaurant.cuisine} · {restaurant.address}</p>
          <StarRating value={restaurant.rating || 0} />
          <p className="muted small">Open {restaurant.openingHours?.open} - {restaurant.openingHours?.close}</p>
        </div>
        <button type="button" className="btn-primary" onClick={handleReserve}>
          {user && user.role === "customer" ? "Reserve a Table" : "Login to Book"}
        </button>
      </div>

      <div className="restaurant-view-tabs">
        <button
          type="button"
          className={activeView === "restaurant" ? "tab active" : "tab"}
          onClick={() => setActiveView("restaurant")}
        >
          Restaurant
        </button>
        <button
          type="button"
          className={activeView === "food" ? "tab active" : "tab"}
          onClick={() => setActiveView("food")}
        >
          Food Menu
        </button>
      </div>

      {activeView === "restaurant" ? (
        <>
          <div className="restaurant-gallery-grid">
            {galleryImages.map((image, index) => (
              <div key={`${restaurant.name}-${index}`} className={`restaurant-gallery-item ${index === 0 ? "wide" : ""}`}>
                <img src={image} alt={`${restaurant.name} view ${index + 1}`} />
              </div>
            ))}
          </div>

          <div className="section-block room-overview-block">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Ambience</p>
                <h2>Spaces designed for memorable moments</h2>
              </div>
            </div>

            <div className="room-grid">
              {roomDetails.map((room) => (
                <div key={room.title} className="room-card">
                  <div className="room-card-visual">🏨</div>
                  <h3>{room.title}</h3>
                  <p className="muted">{room.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="section-block">
          <div className="menu-toolbar">
            <div className="category-tabs">
              <button className={activeCategory === "all" ? "tab active" : "tab"} onClick={() => setActiveCategory("all")}>
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  className={activeCategory === c._id ? "tab active" : "tab"}
                  onClick={() => setActiveCategory(c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="menu-search"
            />
          </div>

          {filteredItems.length === 0 ? (
            <p className="muted">No menu items match your search.</p>
          ) : (
            <div className="menu-grid">
              {filteredItems.map((item) => (
                <MenuItemCard key={item._id} item={{ ...item, restaurantId: id }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
