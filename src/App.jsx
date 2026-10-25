import React, { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import RobotCanvas from './components/RobotCanvas';
import HeroOverlay from './components/HeroOverlay';
import Sponsors from './components/Sponsors';
import Team from './components/Team';
import Contact from './components/Contact';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const theatreRef = useRef(null);
  const activeSecRef = useRef('hero');

  // Mutable state reference for Three.js (Zero React re-render bottleneck!)
  const robotStateRef = useRef({
    targetExplode: 0,
    targetCamX: 0,
    weaponRPM: 0
  });

  useEffect(() => {
    // Automatically clear active focus when switching back from external tabs (LinkedIn)
    const handleFocus = () => {
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    let rawScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    let targetP = 0;
    let currentP = 0;
    let isFirstScroll = true;
    let isRunning = false;
    let animationId = null;

    // Cache DOM nodes once to avoid layout thrashing and DOM query churn
    const elBar = document.getElementById('bar');
    const elHeroOverlay = document.getElementById('heroOverlay');
    const elHeroDisc = document.getElementById('heroDisc');
    const elHeroCue = document.getElementById('heroCue');
    const elHeroRpmVal = document.getElementById('heroRpmVal');
    const elHeroRpmFill = document.getElementById('heroRpmFill');
    const elTelemetryMode = document.getElementById('telemetryMode');
    const elTipSpeedVal = document.getElementById('tipSpeedVal');
    const elKeVal = document.getElementById('keVal');
    const elRobotHud = document.getElementById('robotHud');
    const elStageBadge = document.getElementById('stageStateBadge');
    const elExplodeBar = document.getElementById('explodeBar');
    const elCardSpecs = document.getElementById('cardSpecs');
    const elCardCrew = document.getElementById('cardCrew');
    const elSponsors = document.getElementById('sponsors');
    const elTeam = document.getElementById('team');
    const elContact = document.getElementById('contact');

    // Layout Cache: Pre-calculated document offsets to prevent getBoundingClientRect() during scroll
    let cachedTheatreTop = 0;
    let cachedTheatreHeight = 1;
    let cachedSponsorsTop = 999999;
    let cachedTeamTop = 999999;
    let cachedContactTop = 999999;

    function measureLayout() {
      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const theatre = theatreRef.current;
      if (theatre) {
        const rect = theatre.getBoundingClientRect();
        cachedTheatreTop = scrollY + rect.top;
        cachedTheatreHeight = Math.max(1, theatre.offsetHeight - vh);
      }
      if (elSponsors) {
        cachedSponsorsTop = scrollY + elSponsors.getBoundingClientRect().top;
      }
      if (elTeam) {
        cachedTeamTop = scrollY + elTeam.getBoundingClientRect().top;
      }
      if (elContact) {
        cachedContactTop = scrollY + elContact.getBoundingClientRect().top;
      }
    }

    // Measure initially and on resize / orientation change
    measureLayout();
    const measureTimer = setTimeout(measureLayout, 150);

    // Throttled active section check using cached offsets (Zero layout reflow!)
    let lastSecCheckTime = 0;
    function updateActiveSection(p) {
      const now = performance.now();
      if (now - lastSecCheckTime < 120) return;
      lastSecCheckTime = now;

      const triggerLine = rawScrollY + window.innerHeight * 0.45;
      let nextSec = 'hero';
      if (triggerLine >= cachedContactTop) {
        nextSec = 'contact';
      } else if (triggerLine >= cachedTeamTop) {
        nextSec = 'team';
      } else if (triggerLine >= cachedSponsorsTop) {
        nextSec = 'sponsors';
      } else if (p > 0.16) {
        nextSec = 'robot';
      }

      if (nextSec !== activeSecRef.current) {
        activeSecRef.current = nextSec;
        setActiveSection(nextSec);
      }
    }

    function updateFrame(progress) {
      const isDesktop = window.innerWidth >= 992;

      // 1. Top progress bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (elBar && docHeight > 0) {
        const pct = Math.max(0, Math.min(1, rawScrollY / docHeight));
        elBar.style.transform = `scaleX(${pct})`;
      }

      // 2. Weapon RPM (0 to 10,000 RPM) directly to DOM and robotStateRef (Zero React re-render bottleneck!)
      const ratio = Math.min(1.0, progress / 0.16);
      const rpm = Math.round(ratio * 10000);
      robotStateRef.current.weaponRPM = rpm;

      if (elHeroRpmVal) elHeroRpmVal.textContent = rpm.toString().padStart(4, '0');
      if (elHeroRpmFill) elHeroRpmFill.style.width = (ratio * 100).toFixed(1) + '%';
      if (elTipSpeedVal) elTipSpeedVal.textContent = Math.round(ratio * 247);
      if (elKeVal) elKeVal.textContent = (ratio * ratio * 6.6).toFixed(1);

      if (elTelemetryMode) {
        if (rpm === 0) {
          elTelemetryMode.textContent = 'STANDBY';
          elTelemetryMode.style.color = 'var(--gold)';
        } else if (rpm < 10000) {
          elTelemetryMode.textContent = 'SPINNING UP...';
          elTelemetryMode.style.color = 'var(--flame)';
        } else {
          elTelemetryMode.textContent = 'WEAPON LOCKED // 10,000 RPM';
          elTelemetryMode.style.color = 'var(--laser)';
        }
      }

      // 3. Phase 0: Hero Fly-Through (Snappy on mobile, cinematic on desktop)
      // PERFORMANCE CRITICAL: NEVER toggle display='none' vs 'flex'!
      // Toggling display forces the browser to destroy and rebuild layout boxes, causing scroll lag & blank screen!
      // We toggle visibility and opacity, which are 100% GPU-composited with zero layout thrash.
      const heroThreshold = isDesktop ? 0.18 : 0.09;
      if (progress <= heroThreshold) {
        const p = progress / (heroThreshold * 0.85);
        const clampedP = Math.min(1.0, Math.max(0.0, p));
        const scale = 1.0 + Math.pow(clampedP, 1.35) * 1.15;
        const opacity = Math.max(0, 1.0 - Math.pow(clampedP, 1.3));

        if (elHeroOverlay) {
          elHeroOverlay.style.visibility = 'visible';
          elHeroOverlay.style.opacity = opacity.toFixed(3);
          elHeroOverlay.style.pointerEvents = clampedP > 0.65 ? 'none' : 'auto';
        }
        if (elHeroDisc) {
          elHeroDisc.style.transform = `scale(${scale.toFixed(3)})`;
        }
        if (elHeroCue) {
          elHeroCue.style.opacity = Math.max(0, 1.0 - clampedP * 3.0).toFixed(2);
        }

        if (elRobotHud) elRobotHud.style.opacity = '0';
        if (elCardSpecs) elCardSpecs.classList.remove('active');
        if (elCardCrew) elCardCrew.classList.remove('active');

        robotStateRef.current.targetExplode = 0.0;
        robotStateRef.current.targetCamX = 0;
      } else {
        // Past Hero: Hide overlay smoothly via visibility & opacity (keeps layout cached in GPU)
        if (elHeroOverlay) {
          elHeroOverlay.style.visibility = 'hidden';
          elHeroOverlay.style.opacity = '0';
          elHeroOverlay.style.pointerEvents = 'none';
        }
        if (elRobotHud) elRobotHud.style.opacity = '1';

        // Responsive Staging Thresholds:
        const stage1End = isDesktop ? 0.48 : 0.38;
        const stage2End = isDesktop ? 0.82 : 0.72;

        if (progress < stage1End) {
          // STAGE 1: ASSEMBLED (SPECS)
          if (elCardSpecs) elCardSpecs.classList.add('active');
          if (elCardCrew) elCardCrew.classList.remove('active');
          robotStateRef.current.targetExplode = 0.0;
          robotStateRef.current.targetCamX = isDesktop ? -235 : 0;
          if (elStageBadge) elStageBadge.innerHTML = '<span class="live-dot"></span> STAGE 1/3: ASSEMBLED (SPECS)';
          if (elExplodeBar) elExplodeBar.style.width = '0%';
        } else if (progress >= stage1End && progress < stage2End) {
          // STAGE 2: SUSTAINED EXPLODED VIEW
          if (elCardSpecs) elCardSpecs.classList.remove('active');
          if (elCardCrew) elCardCrew.classList.remove('active');
          robotStateRef.current.targetCamX = 0;
          if (elStageBadge) elStageBadge.innerHTML = '<span class="live-dot"></span> STAGE 2/3: EXPLODED CAD VIEW';

          const range = stage2End - stage1End;
          const pNorm = (progress - stage1End) / range;
          let exp = 0;
          if (pNorm < 0.25) {
            exp = pNorm / 0.25;
          } else if (pNorm <= 0.75) {
            exp = 1.0;
          } else {
            exp = 1.0 - (pNorm - 0.75) / 0.25;
          }
          exp = Math.max(0, Math.min(1.0, exp));
          robotStateRef.current.targetExplode = exp;
          if (elExplodeBar) elExplodeBar.style.width = Math.round(exp * 100) + '%';
        } else {
          // STAGE 3: REASSEMBLED (CREW)
          if (elCardSpecs) elCardSpecs.classList.add('active');
          if (elCardCrew) elCardCrew.classList.add('active');
          robotStateRef.current.targetExplode = 0.0;
          robotStateRef.current.targetCamX = isDesktop ? -235 : 0;
          if (elStageBadge) elStageBadge.innerHTML = '<span class="live-dot"></span> STAGE 3/3: REASSEMBLED (CREW)';
          if (elExplodeBar) elExplodeBar.style.width = '0%';
        }
      }

      updateActiveSection(progress);
    }

    let lastScrollY = window.scrollY;

    function renderLoop() {
      // Smoothly interpolate current progress towards target (0.22 factor provides instant touch responsiveness)
      currentP += (targetP - currentP) * 0.22;
      updateFrame(currentP);

      // IDLE SLEEP: Stop loop completely when settled (Saves 100% CPU when not scrolling!)
      const delta = Math.abs(targetP - currentP);
      if (delta < 0.0002 && Math.abs(rawScrollY - lastScrollY) < 0.5) {
        currentP = targetP;
        updateFrame(currentP);
        isRunning = false;
        animationId = null;
        return;
      }

      lastScrollY = rawScrollY;
      animationId = requestAnimationFrame(renderLoop);
    }

    function wakeLoop() {
      if (!isRunning) {
        isRunning = true;
        animationId = requestAnimationFrame(renderLoop);
      }
    }

    // High performance onScroll: ZERO DOM queries, ZERO layout reflows!
    const onScroll = () => {
      rawScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      targetP = Math.max(0, Math.min(1.0, (rawScrollY - cachedTheatreTop) / cachedTheatreHeight));
      if (isFirstScroll) {
        currentP = targetP;
        isFirstScroll = false;
      }
      wakeLoop();
    };

    const handleResize = () => {
      measureLayout();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    onScroll();

    window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      return () => {
      clearTimeout(measureTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Top Bar & Fixed Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Pinned 3D Robot Machine Theatre */}
      <section className="robot-theatre-track" id="robotTheatre" ref={theatreRef}>
        <div id="hero" style={{ position: 'absolute', top: 0, height: '1px', width: '1px', pointerEvents: 'none' }} />
        <div id="robot" style={{ position: 'absolute', top: '100vh', height: '1px', width: '1px', pointerEvents: 'none' }} />

        <div className="robot-theatre-sticky" id="theatreSticky">
          {/* 3D Robot Viewer Stage (Powered by React Three Fiber) */}
          <div className="robot-canvas-col" id="robotViewer">
            <RobotCanvas stateRef={robotStateRef} />

            {/* In-Viewer Tactical HUD */}
            <div className="robot-hud-overlay" id="robotHud" style={{ opacity: 0 }}>
              <div className="hud-top-bar">
                <div className="telemetry-tag"><span className="live-dot" /> THE LAWNMOWER</div>
              </div>

              <div className="hud-bottom-bar">
                <div className="stage-state-tag" id="stageStateBadge">
                  <span className="live-dot" /> STAGE 1/3: ASSEMBLED (SPECS)
                </div>
                <div className="hud-explode-progress">
                  <div className="hud-explode-bar" id="explodeBar" style={{ width: '0%' }} />
                </div>
                <span className="hud-drag-hint">&bull; DRAG TO ORBIT</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story Cards */}
          <div className="robot-narrative-col">
            {/* STAGE 1: ASSEMBLED & COMBAT SPECS */}
            <article className="theatre-card active" id="cardSpecs">
              <div className="card-meta">
                <span className="story-badge"><span className="live-dot" /> STAGE 01 // TACTICAL TELEMETRY</span>
                <span className="stage-num">01 / 03</span>
              </div>
              <h2 className="card-title">COMBAT SPECIFICATIONS</h2>
              <p className="card-desc">
                Monolithic CNC billet aluminum unibody engineered for extreme impact tolerance, high-speed maneuverability, and structural rigidity.
              </p>
              <dl className="specs-grid-compact">
                <div className="spec-row"><dt>COMBAT CLASS</dt><dd>Featherweight (15 kg / 33 lbs)</dd></div>
                <div className="spec-row"><dt>CHASSIS ARCHITECTURE</dt><dd>CNC Billet 6061-T6 Unibody Tub</dd></div>
                <div className="spec-row"><dt>DRIVE</dt><dd>2-Wheel Drive</dd></div>
              </dl>
              <div className="card-footer">
                <span className="scroll-indicator-pill">&darr; KEEP SCROLLING FOR EXPLODED CAD VIEW</span>
              </div>
            </article>

            {/* STAGE 3: REASSEMBLED & ENGINEERING CREW */}
            <article className="theatre-card" id="cardCrew">
              <div className="card-meta">
                <span className="story-badge"><span className="live-dot" /> STAGE 03 // THE ENGINEERING CREW</span>
                <span className="stage-num">03 / 03</span>
              </div>
              <h2 className="card-title">ENGINEERING TEAM</h2>
              <p className="card-desc" style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--bone)' }}>
                We are a powerhouse crew of <b>10 inter-departmental 3rd-year engineering students from Amrita Vishwa Vidyapeetham</b> united by our passion for heavy-impact combat robotics.
              </p>
              <p className="card-desc" style={{ fontSize: '0.86rem', lineHeight: 1.55, color: 'var(--bone-dim)', marginTop: '8px' }}>
                Forged by an obsession for competitive robotics, we engineer, machine, and battle-test our featherweight battlebots to dominate the National Robowars arenas.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0' }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.68rem', padding: '4px 8px', borderRadius: '3px', background: 'rgba(239,51,64,0.12)', border: '1px solid rgba(239,51,64,0.3)', color: 'var(--laser)' }}>Amrita Vishwa Vidyapeetham</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.68rem', padding: '4px 8px', borderRadius: '3px', background: 'rgba(255,183,50,0.12)', border: '1px solid rgba(255,183,50,0.3)', color: 'var(--title-gold)' }}>10 Multi-Discipline Engineers</span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.68rem', padding: '4px 8px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--bone)' }}>3rd Year Undergrads</span>
              </div>
              <div className="card-footer">
                <a href="#sponsors" className="btn" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>CONTINUE TO SPONSORS &darr;</a>
              </div>
            </article>
          </div>

          {/* HERO PORTAL OVERLAY: Scales 1.0 -> 2.15x and dissolves on scroll! */}
          <HeroOverlay />
        </div>
      </section>

      {/* Official Sponsors with expanding rectangle accordion */}
      <Sponsors />

      {/* Engineering Roster & Battle Squad */}
      <Team />

      {/* Direct Transmission / Contact Form */}
      <Contact />
    </>
  );
}
