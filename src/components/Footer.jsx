import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        width: '100%',
        padding: '50px 24px 30px',
        background: '#070204',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 10
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo.png"
              alt="ASTAROTH ROBOTICS"
              style={{
                height: '36px',
                width: 'auto',
                filter: 'drop-shadow(0 2px 10px rgba(200, 0, 0, 0.4))'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', color: '#fff', letterSpacing: '0.06em' }}>
                ASTAROTH ROBOTICS
              </span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.14em' }}>
                FEATHERWEIGHT DIVISION // LAWNMOWER MK-IV
              </span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--f-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--bone)',
              background: 'rgba(21, 24, 34, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              padding: '10px 18px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--crimson)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = 'var(--bone)';
            }}
          >
            <ArrowUp size={16} />
            RETURN TO TOP
          </button>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontFamily: 'var(--f-mono)',
            fontSize: '0.72rem',
            color: 'var(--bone-dim)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} ASTAROTH ROBOTICS. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>TELEMETRY: VERIFIED</span>
            <span>DIVISION: 15 KG FEATHERWEIGHT</span>
            <span>CHASSIS: BILLET 6061-T6</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
