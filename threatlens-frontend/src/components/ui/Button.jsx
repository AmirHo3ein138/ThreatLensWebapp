import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`ui-btn ui-btn--${variant} ${className}`}
      {...props}
    >
      {loading && <span className="ui-btn__spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}