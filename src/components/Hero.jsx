import React, { useEffect, useRef, useState } from 'react';
import HeroRings from './HeroRings';

export default function Hero({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);

  // Dynamic calculations based on scrollProgress (0 to 0.16)
  const rpmRatio = Math.min(1.0, scrollProgress / 0.16);
  const currentRPM = Math.round(rpmRatio * 10000);
  const tipSpeed = Math.round(rpmRatio * 247);
  const storedKE = (rpmRatio * rpmRatio * 6.6).toFixed(1);

  // Canvas rising forge embers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let h = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth || window.innerWidth;
      h = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 55;
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h + 20,
        r: Math.random() * 2.0 + 0.6,
        vx: (Math.random() - 0.5) * 0.45,
        vy: -(Math.random() * 0.8 + 0.4),
        alpha: Math.random() * 0.7 + 0.25,
        decay: Math.random() * 0.006 + 0.003,
        color: Math.random() > 0.4 ? '255, 138, 61' : '255, 183, 50'
      });
    }

    let animationId;
    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.y < h * 0.35 || p.alpha <= 0) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.alpha = Math.random() * 0.7 + 0.3;
          p.vy = -(Math.random() * 0.8 + 0.4);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.25})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }
      animationId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(20, 10, 12, 0.95) 0%, rgba(13, 5, 7, 0.94) 55%, rgba(7, 2, 3, 0.98) 100%)',
        zIndex: 10
      }}
    >
      {/* Canvas Rising Embers */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* Faint Perspective Arena Floor with Underglow */}
      <div
        style={{
          position: 'absolute',
          width: 'min(120vw, 1050px)',
          height: '420px',
          bottom: '6%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(200, 0, 0, 0.35) 0%, rgba(255, 106, 0, 0.12) 40%, transparent 70%)',
          transform: 'rotateX(68deg)',
          pointerEvents: 'none',
          zIndex: 1,
          border: '1px solid rgba(255, 106, 0, 0.15)',
          boxShadow: '0 0 90px rgba(193, 18, 31, 0.4)'
        }}
        aria-hidden="true"
      />

      {/* Central Disc Container */}
      <div
        style={{
          position: 'relative',
          width: 'min(92vw, 820px)',
          aspectRatio: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'clamp(20px, 3.5vw, 44px)',
          zIndex: 5
        }}
      >
        {/* SVG Counter-Rotating Weapon Rings */}
        <HeroRings rpmRatio={rpmRatio} />

        {/* Central Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%'
          }}
        >
          {/* Team Tag */}
          <span
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 'clamp(0.72rem, 1.1vw, 0.84rem)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              background: 'rgba(14, 16, 22, 0.92)',
              padding: '6px 16px',
              border: '1px solid rgba(255, 183, 50, 0.35)',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.7)'
            }}
          >
            ROBOT COMBAT TEAM // LAWNMOWER DIV
          </span>

          {/* Crisp Centered Logo at Display Size */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '4px 0 6px', width: '100%' }}>
            <img
              src="/logo.png"
              alt="ASTAROTH ROBOTICS"
              style={{
                maxWidth: 'min(88%, 460px)',
                height: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 35px rgba(200, 0, 0, 0.35))',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: 'var(--f-heading)',
              fontSize: 'clamp(1.05rem, 2.2vw, 1.4rem)',
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#fff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(200, 0, 0, 0.3)'
            }}
          >
            HOME OF THE LAWNMOWER
          </div>

          {/* Small Mono Readout Under Logo: WEAPON RPM 0000 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(14, 16, 22, 0.92)',
              border: '1px solid rgba(200, 0, 0, 0.35)',
              borderRadius: '4px',
              padding: '8px 18px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
              width: 'min(90%, 340px)',
              marginTop: '2px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                fontFamily: 'var(--f-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em'
              }}
            >
              <span style={{ color: 'var(--bone-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--molten)',
                    borderTopColor: 'transparent',
                    animation: 'spinClockwise 0.8s linear infinite',
                    display: 'inline-block'
                  }}
                />
                WEAPON STATUS
              </span>
              <span
                style={{
                  color: currentRPM === 0 ? 'var(--gold)' : currentRPM < 10000 ? 'var(--molten)' : 'var(--crimson)',
                  fontWeight: 700
                }}
              >
                {currentRPM === 0 ? 'STANDBY' : currentRPM < 10000 ? 'SPINNING UP...' : 'WEAPON LOCKED // 10,000 RPM'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px', margin: '1px 0' }}>
              <span
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#fff',
                  textShadow: '0 0 12px rgba(255, 106, 0, 0.6)'
                }}
              >
                {currentRPM.toString().padStart(currentRPM >= 10000 ? 5 : 4, '0')}
              </span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--molten)' }}>
                RPM
              </span>
            </div>

            <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden', borderRadius: '2px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(rpmRatio * 100).toFixed(1)}%`,
                  background: 'linear-gradient(90deg, var(--ember), var(--gold))',
                  boxShadow: '0 0 8px var(--ember)',
                  transition: 'width 0.08s linear'
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                fontFamily: 'var(--f-mono)',
                fontSize: '0.65rem',
                color: 'var(--bone-dim)'
              }}
            >
              <span>TIP SPEED: <b style={{ color: 'var(--bone)' }}>{tipSpeed}</b> KM/H</span>
              <span>STORED KE: <b style={{ color: 'var(--bone)' }}>{storedKE}</b> KJ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <a
        href="#the-machine"
        style={{
          position: 'absolute',
          bottom: '26px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--f-mono)',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--bone)',
          textDecoration: 'none',
          zIndex: 10
        }}
      >
        <span>SCROLL TO ENTER ARENA</span>
        <span style={{ color: 'var(--molten)', fontSize: '1.1rem' }}>&darr;</span>
      </a>
    </section>
  );
}
