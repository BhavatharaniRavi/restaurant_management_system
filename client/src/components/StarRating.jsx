export default function StarRating({ value = 0, size = 16 }) {
  const rounded = Math.round(value * 2) / 2;
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className="star-rating" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span key={s} className={s <= rounded ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <span className="rating-value">({value.toFixed(1)})</span>
    </span>
  );
}
