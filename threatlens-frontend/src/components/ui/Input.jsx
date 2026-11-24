import './Input.css';

export default function Input({
  label,
  id,
  error,
  ltr = false,
  className = '',
  ...props
}) {
  return (
    <div className={`ui-field ${className}`}>
      {label && (
        <label htmlFor={id} className="ui-field__label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`ui-field__input ${ltr ? 'ui-field__input--ltr' : ''} ${
          error ? 'ui-field__input--error' : ''
        }`}
        {...props}
      />
      {error && <span className="ui-field__error">{error}</span>}
    </div>
  );
}