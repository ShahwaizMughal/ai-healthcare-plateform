import { useState } from 'react'
import { Stethoscope, Pill, FlaskConical } from 'lucide-react'
import Button from '../../components/common/Button'
import ServiceCard from '../../components/common/ServiceCard'
import StatCounter from '../../components/common/StatCounter'
import TestimonialCard from '../../components/common/TestimonialCard'
import heroDoctor from '../../assets/hero.jpg'

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: '#F4F9F9', padding: '60px var(--spacing-lg)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
            <span
              style={{
                display: 'inline-block',
                background: '#fff',
                color: 'var(--color-primary)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              Trusted by 10,000+ patients
            </span>

            <h1
              style={{
                fontSize: '46px',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Your Health,<br />
              <span style={{ color: 'var(--color-accent)' }}>Our Priority</span>
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: '#555',
                maxWidth: '440px',
                marginBottom: '32px',
                lineHeight: 1.6,
              }}
            >
              Compassionate care for you and your family. Book trusted doctors, order medicines, and manage your health in one place.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
              <Button variant="primary">Book an Appointment</Button>
              <Button variant="secondary">Browse Doctors</Button>
            </div>

            <div style={{ display: 'flex', gap: '16px', maxWidth: '440px' }}>
              <StatCounter value={20} suffix="+" label="Years of experience" />
              <StatCounter value={95} suffix="%" label="Patient satisfaction" />
              <StatCounter value={5000} suffix="+" label="Patients served" />
            </div>
          </div>

          <div style={{ flex: '1 1 380px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                right: '0px',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                borderRadius: 'var(--radius-lg)',
                zIndex: 0,
              }}
            />
            <img
              src={heroDoctor}
              alt="Doctor consulting with a patient"
              style={{
                position: 'relative',
                left: '-24px',
                zIndex: 1,
                width: '100%',
                height: '420px',
                objectFit: 'cover',
                objectPosition: 'top',
                borderRadius: 'var(--radius-lg)',
                display: 'block',
                boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <DoctorsSlider />

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  )
}

function DoctorsSlider() {
  const doctors = [
    { name: 'Dr. Ayesha Khan', specialty: 'Cardiology', photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80' },
    { name: 'Dr. Bilal Ahmed', specialty: 'Neurology', photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80' },
    { name: 'Dr. Sara Malik', specialty: 'Pediatrics', photo: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80' },
    { name: 'Dr. Usman Tariq', specialty: 'Orthopedics', photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80' },
    { name: 'Dr. Farah Iqbal', specialty: 'Dermatology', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' },
    { name: 'Dr. Zeeshan Ali', specialty: 'General Physician', photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80' },
  ]

  const [index, setIndex] = useState(0)
  const total = doctors.length

  const sideWidth = 260
  const centerWidth = 320
  const gap = 24

  const goPrev = () => setIndex((i) => (i - 1 + total) % total)
  const goNext = () => setIndex((i) => (i + 1) % total)

  // Always exactly 3 cards: previous, center, next — wraps around so index 0 still shows a "previous" card
  const visible = [-1, 0, 1].map((offset) => {
    const i = (index + offset + total) % total
    return { ...doctors[i], isCenter: offset === 0, key: `${i}-${offset}` }
  })

  return (
    <section style={{ padding: '60px var(--spacing-lg)', background: 'var(--color-primary-dark, #0A5C63)', overflowX: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span
          style={{
            display: 'inline-block',
            color: '#8FD4CC',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            borderBottom: '2px solid #8FD4CC',
            paddingBottom: '4px',
          }}
        >
          Our Specialists
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '8px', marginTop: '10px' }}>
          Meet Our Medical Team
        </h2>
        <p style={{ color: '#D7E9E9', fontSize: '15px', maxWidth: '460px', margin: '0 auto' }}>
          Experienced professionals dedicated to your health and wellbeing
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: `${sideWidth * 2 + centerWidth + gap * 2 + 160}px`, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${gap}px`,
            padding: '20px 0',
          }}
        >
          {visible.map((doctor) => {
            const width = doctor.isCenter ? centerWidth : sideWidth
            return (
              <div
                key={doctor.key}
                style={{
                  flex: `0 0 ${width}px`,
                  opacity: doctor.isCenter ? 1 : 0.75,
                  transition: 'all 0.4s ease',
                }}
              >
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    textAlign: 'center',
                    boxShadow: doctor.isCenter
                      ? '0 16px 32px rgba(0,0,0,0.3)'
                      : '0 6px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    style={{
                      width: '100%',
                      height: doctor.isCenter ? '260px' : '210px',
                      objectFit: 'cover',
                      objectPosition: 'top',
                      display: 'block',
                    }}
                  />
                  <div style={{ padding: '18px 16px 22px' }}>
                    <h3
                      style={{
                        fontSize: doctor.isCenter ? '18px' : '15px',
                        fontWeight: doctor.isCenter ? 800 : 600,
                        color: 'var(--color-primary-dark)',
                        marginBottom: '4px',
                      }}
                    >
                      {doctor.name}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-primary)',
                        fontSize: doctor.isCenter ? '14px' : '12px',
                        fontWeight: doctor.isCenter ? 700 : 400,
                        marginBottom: '16px',
                      }}
                    >
                      {doctor.specialty}
                    </p>
                    <button
                      style={{
                        width: '100%',
                        padding: '9px 0',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={goPrev}
          aria-label="Previous doctors"
          style={{
            position: 'absolute',
            top: '50%',
            left: '-24px',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            color: 'var(--color-primary-dark, #0A5C63)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 700,
            zIndex: 3,
          }}
        >
          ‹
        </button>
        <button
          onClick={goNext}
          aria-label="Next doctors"
          style={{
            position: 'absolute',
            top: '50%',
            right: '-24px',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            color: 'var(--color-primary-dark, #0A5C63)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 700,
            zIndex: 3,
          }}
        >
          ›
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {doctors.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === index ? '22px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: i === index ? '#fff' : 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                transition: 'width 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const services = [
    {
      icon: <Stethoscope size={26} />,
      title: 'Doctor Booking',
      desc: 'Search verified specialists and book a conflict-free appointment in minutes.',
    },
    {
      icon: <Pill size={26} />,
      title: 'Online Pharmacy',
      desc: 'Order prescription and over-the-counter medicines with fast, tracked delivery.',
    },
    {
      icon: <FlaskConical size={26} />,
      title: 'Lab Tests',
      desc: 'Schedule diagnostic tests and view your reports securely from your account.',
    },
  ]

  return (
    <section style={{ padding: '80px var(--spacing-lg)', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span
          style={{
            display: 'inline-block',
            color: 'var(--color-primary)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            borderBottom: '2px solid var(--color-primary)',
            paddingBottom: '4px',
          }}
        >
          What We Offer
        </span>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--color-primary-dark)',
            marginTop: '10px',
          }}
        >
          Our Core Services
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {services.map((svc) => (
          <ServiceCard
            key={svc.title}
            icon={svc.icon}
            title={svc.title}
            description={svc.desc}
          />
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      text: 'Booking an appointment was seamless. The conflict-free scheduling actually worked, no double bookings, no confusion.',
      name: 'Sarah Jenkins',
      role: 'Patient',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    },
    {
      text: 'Fast checkout and prescription validation. The medicine delivery tier saved me a trip to the pharmacy twice this month.',
      name: 'Michael Chang',
      role: 'Patient',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    },
    {
      text: 'Lab results were up on my account the same day. Clean interface, no digging through emails for a PDF.',
      name: 'Aiman Raza',
      role: 'Patient',
      photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
    },
  ]

  return (
    <section style={{ padding: '80px var(--spacing-lg)', background: 'var(--color-background, #F4F9F9)' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span
          style={{
            display: 'inline-block',
            color: 'var(--color-primary)',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            borderBottom: '2px solid var(--color-primary)',
            paddingBottom: '4px',
          }}
        >
          Testimonials
        </span>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--color-primary-dark)',
            marginTop: '10px',
          }}
        >
          What Our Patients Say
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {testimonials.map((t) => (
          <TestimonialCard
            key={t.name}
            text={t.text}
            name={t.name}
            role={t.role}
            photo={t.photo}
          />
        ))}
      </div>
    </section>
  )
}

export default Home