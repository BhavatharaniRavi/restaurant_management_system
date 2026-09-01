export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {subtitle ? <p className="muted">{subtitle}</p> : null}
    </div>
  );
}
