function TestimonialCard({ text, name, role, photo }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
      }}
    >
      <p style={{ fontSize: '15px', color: '#444', lineHeight: 1.7, marginBottom: '20px' }}>
        "{text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={photo}
          alt={name}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary-dark)' }}>
            {name}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>{role}</div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard