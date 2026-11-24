import './Card.css';

export default function Card({ title, subtitle, children, className = '' }) {
  return (
    <section className={`ui-card ${className}`}>
      {(title || subtitle) && (
        <div className="ui-card__header">
          {title && <h2 className="ui-card__title">{title}</h2>}
          {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="ui-card__body">{children}</div>
    </section>
  );
}