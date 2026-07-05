function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  name,
  required = false,
}) {
  return (
    <div style={{ marginBottom: 'var(--spacing-md)', textAlign: 'left' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-primary-dark)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 150ms, box-shadow 150ms',
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 3px rgba(14,124,134,0.15)'
          }
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = 'none'
          e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'
        }}
      />

      {error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '13px',
            color: 'var(--color-danger)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Input