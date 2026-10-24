import React from 'react';
import { Layers, MoveHorizontal, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ExplodedStage({ explodeProgress, setExplodeProgress }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 10
      }}
    >
      <div
        className="chamfer-card"
        style={{
          background: 'rgba(14, 16, 22, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(200, 0, 0, 0.4)',
          padding: 'clamp(20px, 3vw, 36px)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(200, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                background: 'rgba(255, 183, 50, 0.1)',
                padding: '4px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 183, 50, 0.3)'
              }}
            >
              EXPLODED CAD ASSEMBLY // STAGE 02
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '0.75rem',
              color: 'var(--bone-dim)',
              letterSpacing: '0.08em'
            }}
          >
            DISPLACEMENT: {Math.round(explodeProgress * 100)}%
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--f-display)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            color: '#fff',
            margin: '0 0 8px 0',
            letterSpacing: '0.04em'
          }}
        >
          INTERNAL <span style={{ color: 'var(--crimson)' }}>KINEMATICS</span> & DECOUPLING
        </h2>
        <p
          style={{
            fontFamily: 'var(--f-body)',
            fontSize: '0.98rem',
            color: 'var(--bone)',
            maxWidth: '720px',
            margin: '0 0 24px 0',
            lineHeight: 1.6
          }}
        >
          Inspect the decoupled drive pods and kinetic drum assembly. The structural tub is machined from a single continuous billet of 6061-T6 aluminum—forming an impenetrable unibody cell that never separates.
        </p>

        {/* Interactive Scrub Control */}
        <div
          style={{
            background: 'rgba(21, 24, 34, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MoveHorizontal size={16} color="var(--molten)" />
              ASSEMBLY EXPLOSION SCRUBBER
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setExplodeProgress(0)}
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  background: explodeProgress === 0 ? 'var(--crimson)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid ' + (explodeProgress === 0 ? 'var(--crimson)' : 'rgba(255,255,255,0.15)'),
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                LOCKED (0%)
              </button>
              <button
                onClick={() => setExplodeProgress(1)}
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  background: explodeProgress === 1 ? 'var(--crimson)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  border: '1px solid ' + (explodeProgress === 1 ? 'var(--crimson)' : 'rgba(255,255,255,0.15)'),
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                EXPLODED (100%)
              </button>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodeProgress}
            onChange={(e) => setExplodeProgress(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--crimson)',
              cursor: 'pointer',
              height: '6px'
            }}
          />
        </div>

        {/* 3 Callout Cards Explaining Subsystems */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          <div
            style={{
              background: 'rgba(200, 0, 0, 0.1)',
              border: '1px solid rgba(200, 0, 0, 0.4)',
              borderRadius: '4px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="var(--crimson)" />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                SOLID UNIBODY CHASSIS
              </span>
            </div>
            <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--bone)', margin: 0 }}>
              Locked central monocoque tub. Fused single piece that never separates or explodes under any combat force.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 106, 0, 0.1)',
              border: '1px solid rgba(255, 106, 0, 0.4)',
              borderRadius: '4px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ArrowUpRight size={18} color="var(--molten)" />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                ASYMMETRIC DRUM WEAPON
              </span>
            </div>
            <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--bone)', margin: 0 }}>
              Precision S7 tool steel weapon decoupling forward by 105 mm along its center bearing axis for maintenance.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 183, 50, 0.1)',
              border: '1px solid rgba(255, 183, 50, 0.4)',
              borderRadius: '4px',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <MoveHorizontal size={18} color="var(--gold)" />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                DUAL TRACTION WHEELS
              </span>
            </div>
            <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--bone)', margin: 0 }}>
              Cast polyurethane high-durometer wheels slide laterally ±110 mm along steel keyed dead-axle shafts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
