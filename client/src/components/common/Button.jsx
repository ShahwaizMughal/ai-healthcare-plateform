function Button({ children, variant = 'primary', onClick, type = 'button' }) {
  const styles = {
    primary: {
      background: 'var(--color-primary)',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#fff',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: 'none',
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 600,
        minHeight: '44px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

export default Button