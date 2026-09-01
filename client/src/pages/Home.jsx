import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const categories = [
  { icon: "🍕", label: "Pizza" },
  { icon: "🍔", label: "Burgers" },
  { icon: "🍛", label: "Biryani" },
  { icon: "🥗", label: "Healthy" },
  { icon: "🍜", label: "Chinese" },
  { icon: "🍰", label: "Desserts" },
  { icon: "☕", label: "Beverages" },
  { icon: "🌮", label: "Wraps" },
];

const offers = [
  { title: "Flat 50% Off", text: "Use code FOODIE50 on your first order from select restaurants." },
  { title: "Free Delivery", text: "Enjoy free delivery on orders above ₹249 this weekend." },
  { title: "Chef Specials", text: "Explore limited-time signature meals curated by top chefs." },
];

const features = [
  { icon: "🏷️", title: "Best Offers", text: "Exclusive deals and loyalty rewards on every order." },
  { icon: "🚚", title: "Fast Delivery", text: "Fresh food delivered quickly to your doorstep." },
  { icon: "🍽️", title: "Easy Reservations", text: "Book a table in seconds with restaurant availability." },
  { icon: "⭐", title: "Top Rated", text: "Loved by thousands of happy customers across the city." },
];

const restaurants = [
  { name: "Spice Route", cuisine: "South Indian • 25 min", rating: 4.8 },
  { name: "Royal Biryani", cuisine: "Biryani • 33 min", rating: 4.7 },
  { name: "Pizza Hub", cuisine: "Italian • 28 min", rating: 4.6 },
  { name: "Green Bowl", cuisine: "Healthy • 20 min", rating: 4.9 },
  { name: "Maharaja Kitchen", cuisine: "North Indian • 32 min", rating: 4.8 },
  { name: "Wok & Roll", cuisine: "Chinese • 27 min", rating: 4.5 },
  { name: "Burger District", cuisine: "Fast Food • 20 min", rating: 4.7 },
  { name: "Saffron Dine", cuisine: "Multi-Cuisine • 35 min", rating: 4.9 },
];

const foodHighlights = [
  { name: "Paneer Tikka Bowl", price: "₹249", tag: "Popular" },
  { name: "Chicken Biryani", price: "₹299", tag: "Best Seller" },
  { name: "Cheese Burst Pizza", price: "₹349", tag: "Top Rated" },
  { name: "Veggie Wrap", price: "₹179", tag: "Healthy" },
  { name: "Butter Naan Combo", price: "₹229", tag: "Combo" },
  { name: "Cold Coffee", price: "₹119", tag: "Bestseller" },
];

const reviews = [
  { name: "Mina Patel", text: "Quick delivery, great taste, and a very smooth booking experience." },
  { name: "Daniel Cruz", text: "The website feels premium and the food was fresh and hot on arrival." },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-overlay" />
        <div className="hero-content-box">
          <p className="eyebrow">Order food • Book tables</p>
          <h1>Craving something delicious near you?</h1>
          <p>
            Discover the best restaurants in your city, order favorite meals in minutes, and reserve a table for your next memorable dinner.
          </p>

          <div className="swiggy-search-card">
            <div className="swiggy-search-card-row">
              <input type="text" placeholder="Search for restaurants, dishes, or cuisine" />
              <Link to="/restaurants" className="btn-primary">Search</Link>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/restaurants" className="btn-primary">Order Now</Link>
            <Link to="/login" className="btn-outline light">Login to Book</Link>
          </div>

          <div className="hero-stats">
            <span className="hero-stat">⭐ 4.9 rating</span>
            <span className="hero-stat">🕒 25 min avg delivery</span>
            <span className="hero-stat">🍽️ 500+ restaurants</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Popular cuisines" title="What are you craving today?" subtitle="Browse trending food categories and book your favorites in just a few clicks." />
        <div className="category-grid">
          {categories.map((item) => (
            <Link className="category-card" key={item.label} to="/restaurants">
              <span>{item.icon}</span>
              <h3>{item.label}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Food favorites" title="Popular dishes near you" subtitle="Fresh, flavorful, and loved by local foodies every day." />
        <div className="food-grid">
          {foodHighlights.map((food) => (
            <div className="food-card" key={food.name}>
              <div className="food-tag">{food.tag}</div>
              <div className="food-image">🍽️</div>
              <h3>{food.name}</h3>
              <div className="food-meta">
                <span>{food.price}</span>
                <span>⭐ 4.7</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Featured restaurants" title="Popular picks near you" subtitle="Handpicked options loved by local diners for taste, service, and value." />
        <div className="feature-grid restaurants-grid">
          {restaurants.map((restaurant) => (
            <div className="feature-card" key={restaurant.name}>
              <div className="feature-icon">🍴</div>
              <h3>{restaurant.name}</h3>
              <p className="muted">{restaurant.cuisine}</p>
              <p className="small">⭐ {restaurant.rating}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Why choose us" title="Made for convenient dining" subtitle="Fresh food, quick service, and easy reservations in one place." />
        <div className="feature-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p className="muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Customer reviews" title="What diners are saying" subtitle="Satisfied customers keep returning for the quality and convenience." />
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <p className="small">★★★★★</p>
              <p>“{review.text}”</p>
              <h3>{review.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
