import React from 'react';
import { Shield, Zap, Gauge, Cpu, Activity, Award } from 'lucide-react';

export default function SpecsCard({ activeHotspot }) {
  const specs = [
    {
      icon: <Award size={18} color="var(--gold)" />,
      label: 'COMPETITION CLASS',
      value: 'FEATHERWEIGHT',
      sub: '15.00 KG // STRICT COMPLIANCE'
    },
    {
      icon: <Shield size={18} color="var(--molten)" />,
      label: 'CHASSIS ARCHITECTURE',
      value: 'BILLET 6061-T6',
      sub: '5-AXIS CNC SOLID MONOCOQUE TUB'
    },
    {
      icon: <Gauge size={18} color="var(--ember)" />,
      label: 'DRIVE TOP SPEED',
      value: '24 KM/H',
      sub: 'DUAL BRUSHLESS 2WD TRACTION'
    },
    {
      icon: <Cpu size={18} color="var(--gold)" />,
      label: 'POWER ARCHITECTURE',
      value: '6S 22.2V LIPO',
      sub: '75C CONTINUOUS DISCHARGE'
    },
    {
      icon: <Activity size={18} color="var(--molten)" />,
      label: 'ARMOR METALLURGY',
      value: 'HARDOX 500',
      sub: 'LASER PROFILED ABRASION SHIELDS'
    },
    {
      icon: <Shield size={18} color="var(--crimson)" />,
      label: 'CHASSIS FOOTPRINT',
      value: '380 × 370 MM',
      sub: '155 MM LOW-PROFILE PROFILE'
    }
  ];

  return (
    <div
      className="chamfer-card"
      style={{
        position: 'relative',
        background: 'rgba(14, 16, 22, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(200, 0, 0, 0.35)',
        padding: 'clamp(20px, 3vw, 32px)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(200, 0, 0, 0.2)',
        maxWidth: '520px',
        width: '100%',
        color: '#ffffff',
        zIndex: 10
      }}
    >
      {/* Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--crimson)',
              boxShadow: '0 0 10px var(--crimson)'
            }}
          />
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--gold)',
              textTransform: 'uppercase'
            }}
          >
            TALE OF THE TAPE // TELEMETRY
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--f-mono)',
            fontSize: '0.72rem',
            color: 'var(--bone-dim)',
            letterSpacing: '0.08em'
          }}
        >
          SYS: READY
        </span>
      </div>

      {/* Main Title */}
      <h3
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
          letterSpacing: '0.04em',
          margin: '0 0 6px 0',
          color: '#ffffff',
          lineHeight: 1.1
        }}
      >
        LAWNMOWER <span style={{ color: 'var(--molten)' }}>MK-IV</span>
      </h3>
      <p
        style={{
          fontFamily: 'var(--f-body)',
          fontSize: '0.92rem',
          color: 'var(--bone)',
          margin: '0 0 20px 0',
          lineHeight: 1.5
        }}
      >
        Engineered for absolute structural rigidity in the featherweight combat division. Solid billet monocoque eliminates weld fatigue under high-G impacts.
      </p>

      {/* Grid of Clean Non-Weapon Specs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          marginBottom: '20px'
        }}
      >
        {specs.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(21, 24, 34, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {item.icon}
              <span
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.66rem',
                  letterSpacing: '0.1em',
                  color: 'var(--bone-dim)',
                  textTransform: 'uppercase'
                }}
              >
                {item.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.04em'
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.62rem',
                color: 'var(--gold)',
                letterSpacing: '0.04em'
              }}
            >
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Hotspot Callout if selected in 3D */}
      {activeHotspot && (
        <div
          style={{
            background: 'rgba(200, 0, 0, 0.15)',
            border: '1px solid var(--crimson)',
            borderRadius: '4px',
            padding: '10px 14px',
            fontFamily: 'var(--f-mono)',
            fontSize: '0.75rem',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            SELECTED COMPONENT: <b style={{ color: 'var(--molten)' }}>{activeHotspot.toUpperCase()}</b>
          </span>
          <span style={{ color: 'var(--gold)' }}>ACTIVE INSPECTION</span>
        </div>
      )}
    </div>
  );
}
