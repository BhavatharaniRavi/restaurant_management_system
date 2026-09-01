import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function RestaurantCard({ restaurant }) {
  const deliveryTime = restaurant.deliveryTime || "25 mins";
  const distance = restaurant.distance || "1.2 km";
  const minOrder = restaurant.minOrder || "$15";
  const rating = restaurant.rating?.toFixed(1) || "4.8";

  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-card-img">
        {restaurant.imageUrl ? (
          <img src={restaurant.imageUrl} alt={restaurant.name} />
        ) : (
          <div className="img-placeholder">🍴</div>
        )}
        <span className="offer-pill">20% OFF</span>
      </div>
      <div className="restaurant-card-body">
        <div className="card-top-row">
          <h3>{restaurant.name}</h3>
          <span className="status-pill">Open Now</span>
        </div>
        <p className="muted cuisine-text">{restaurant.cuisine}</p>
        <div className="meta-row">
          <StarRating value={restaurant.rating || 0} />
          <span className="meta-chip">⭐ {rating}</span>
        </div>
        <div className="meta-row details-row">
          <span>{deliveryTime}</span>
          <span>{distance}</span>
          <span>Min {minOrder}</span>
        </div>
        <p className="small muted">Signature dining, private seating, and chef-led service.</p>
      </div>
    </Link>
  );
}
