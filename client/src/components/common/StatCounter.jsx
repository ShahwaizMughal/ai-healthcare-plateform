import { useEffect, useRef, useState } from 'react'

function StatCounter({ value, suffix = '', label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const stepTime = 16
          const totalSteps = duration / stepTime
          const increment = value / totalSteps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.ceil(current))
            }
          }, stepTime)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        padding: '14px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        flex: '1 1 0',
        boxSizing: 'border-box',
        textAlign: 'left',
      }}
    >
      <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
        {label}
      </div>
    </div>
  )
}

export default StatCounter