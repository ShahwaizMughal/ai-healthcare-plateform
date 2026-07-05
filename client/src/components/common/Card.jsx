function Card({ children, hoverable = false, style = {} }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg, 12px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        padding: '20px',
        transition: hoverable ? 'transform 200ms ease, box-shadow 200ms ease' : 'none',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'
        }
      }}
    >
      {children}
    </div>
  )
}

export default Card