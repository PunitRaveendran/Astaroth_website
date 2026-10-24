import React, { useEffect, useRef } from 'react';
import HeroRings from './HeroRings';

function HeroOverlay({ rpmRatio = 0 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // Rising embers particles on canvas with auto-pause when hidden
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

    const count = 45;
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

    let isVisible = true;

    // Check visibility via IntersectionObserver to save 100% canvas CPU when scrolled past
    let observer;
    if (window.IntersectionObserver) {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animRef.current) {
          loop();
        }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    function loop() {
      if (!isVisible) {
        animRef.current = null;
        return;
      }
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
      animRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className="hero-portal-overlay"
      id="heroOverlay"
      style={{
        opacity: 1,
        pointerEvents: 'auto',
        display: 'flex',
        visibility: 'visible'
      }}
    >
      {/* Ambient Canvas with Rising Embers */}
      <div className="hero-ambient" aria-hidden="true">
        <canvas id="heroParticles" ref={canvasRef} />
      </div>

      {/* Faint Perspective Arena Floor with Underglow */}
      <div className="arena-floor" aria-hidden="true" />

      {/* Main Disc: Scales up 1.0 -> 2.15x as user scrolls */}
      <div className="disc" id="heroDisc">
        {/* Counter-Rotating Infernal Arena Weapon Rings */}
        <div className="sigil-svg-layer" id="heroSigil" aria-hidden="true">
          <HeroRings rpmRatio={rpmRatio} />
        </div>

        {/* Central Content */}
        <div className="hero-content" id="heroContent">
          <span className="hero-team-tag">ROBOT COMBAT TEAM</span>

          <div className="hero-emblem-container">
            <img className="hero-logo-img" src="/logo.png" alt="Astaroth Robotics" />
          </div>

          <div className="hero-sub">HOME OF THE LAWNMOWER</div>

          {/* Weapon Status Telemetry: 0 to 10,000 RPM */}
          <div className="hero-weapon-telemetry" id="heroTelemetry">
            <div className="telemetry-row">
              <span className="telemetry-tag">
                <span className="spin-icon" />
                WEAPON STATUS
              </span>
              <span className="telemetry-mode" id="telemetryMode" style={{ color: 'var(--gold)' }}>
                STANDBY
              </span>
            </div>

            <div className="telemetry-main">
              <span className="telemetry-rpm-val" id="heroRpmVal">
                0000
              </span>
              <span className="telemetry-rpm-unit">RPM</span>
            </div>

            <div className="telemetry-bar-wrap">
              <div
                className="telemetry-bar-fill"
                id="heroRpmFill"
                style={{ width: '0%' }}
              />
            </div>

            <div className="telemetry-substats">
              <span>TIP SPEED: <b id="tipSpeedVal">0</b> KM/H</span>
              <span>STORED KE: <b id="keVal">0.0</b> KJ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Cue */}
      <a
        className="cue"
        id="heroCue"
        href="#robot"
        onClick={(e) => {
          e.preventDefault();
          const target = window.innerHeight * 1.5;
          window.scrollTo({ top: target, behavior: 'smooth' });
        }}
      >
        SCROLL TO ENTER ARENA<span className="line" />
      </a>
    </div>
  );
}

export default React.memo(HeroOverlay);
