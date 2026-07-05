function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        background: '#fff',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '20px', color: 'var(--color-primary)' }}>
        HealthCare+
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        <a href="#" style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}>Home</a>
        <a href="#" style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}>Doctors</a>
        <a href="#" style={{ color: 'var(--color-primary-dark)', textDecoration: 'none' }}>Medicines</a>
        <a href="#" style={{ color: 'var(--color-danger)', textDecoration: 'none', fontWeight: 600 }}>Emergency</a>
      </div>
    </nav>
  )
}

export default Navbar