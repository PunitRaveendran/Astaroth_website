import React from 'react';

// Static precomputed ticks & seal marks to avoid re-generating 80 SVG nodes on render
const TICKS = [];
for (let i = 0; i < 72; i++) {
  const angle = (i * 5) * (Math.PI / 180);
  const isMajor = (i % 9 === 0);
  const r1 = isMajor ? 268 : 276;
  const r2 = 286;
  const x1 = (300 + r1 * Math.cos(angle)).toFixed(1);
  const y1 = (300 + r1 * Math.sin(angle)).toFixed(1);
  const x2 = (300 + r2 * Math.cos(angle)).toFixed(1);
  const y2 = (300 + r2 * Math.sin(angle)).toFixed(1);
  const stroke = isMajor ? '#ffb732' : 'rgba(239,51,64,0.45)';
  const width = isMajor ? '2' : '1';
  TICKS.push(
    <line
      key={'tick-' + i}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={width}
      opacity={0.85}
    />
  );
}

const SEAL_MARKS = [];
for (let j = 0; j < 8; j++) {
  const angle = (j * 45) * (Math.PI / 180);
  const cx = (300 + 262 * Math.cos(angle)).toFixed(1);
  const cy = (300 + 262 * Math.sin(angle)).toFixed(1);
  SEAL_MARKS.push(
    <g key={'seal-' + j}>
      <circle cx={cx} cy={cy} r="3" fill="#ffb732" opacity={0.75} />
      <circle cx={cx} cy={cy} r="7" stroke="rgba(255,183,50,0.4)" strokeWidth="1" fill="none" />
    </g>
  );
}

function HeroRings({ rpmRatio = 0 }) {
  // Stepped rotation duration so browser does not thrash keyframe animations every micro-fraction
  const steppedRatio = Math.round(rpmRatio * 20) / 20; // 5% discrete increments
  const extraSpeed = steppedRatio * 4.5;
  const bladeDuration = Math.max(2.5, 22 / (1 + extraSpeed)).toFixed(1) + 's';
  const sprocketDuration = Math.max(1.8, 15 / (1 + extraSpeed)).toFixed(1) + 's';

  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'visible'
      }}
    >
      <defs>
        <linearGradient id="bladeTrailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb732" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#ff8a3d" stopOpacity="0.6" />
          <stop offset="85%" stopColor="#c80000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c80000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hubForgeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="85%" stopColor="rgba(255,138,61,0.18)" />
          <stop offset="100%" stopColor="rgba(200,0,0,0.35)" />
        </radialGradient>
      </defs>

      {/* RING 1: OUTER CALIBRATION TICK & SEAL RING (Clockwise, 42s) */}
      <g style={{ transformOrigin: '300px 300px', animation: 'spinClockwise 42s linear infinite' }}>
        <circle cx="300" cy="300" r="286" stroke="rgba(200, 0, 0, 0.35)" strokeWidth="1.5" />
        <circle cx="300" cy="300" r="270" stroke="rgba(255, 138, 61, 0.45)" strokeWidth="1" strokeDasharray="16 12" />
        {TICKS}
        {SEAL_MARKS}
      </g>

      {/* RING 2: COUNTER-ROTATING BLADE TRAILS (Counter-Clockwise) */}
      <g style={{ transformOrigin: '300px 300px', animation: `spinCounterClockwise ${bladeDuration} linear infinite` }}>
        <circle cx="300" cy="300" r="236" stroke="rgba(255, 138, 61, 0.2)" strokeWidth="1.2" />
        <path d="M 300 64 A 236 236 0 0 1 525 220" stroke="url(#bladeTrailGrad1)" strokeWidth="6" strokeLinecap="round" />
        <path d="M 300 64 A 236 236 0 0 1 450 130" stroke="#ffb732" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <path d="M 300 536 A 236 236 0 0 1 75 380" stroke="url(#bladeTrailGrad1)" strokeWidth="6" strokeLinecap="round" />
        <path d="M 300 536 A 236 236 0 0 1 150 470" stroke="#ffb732" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        
        
      </g>

      {/* RING 3: SLOTTED TITANIUM ROTOR SPROCKET (Clockwise) */}
      <g style={{ transformOrigin: '300px 300px', animation: `spinClockwise ${sprocketDuration} linear infinite` }}>
        <circle cx="300" cy="300" r="184" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
        <circle cx="300" cy="300" r="172" stroke="rgba(255, 138, 61, 0.4)" strokeWidth="2.5" strokeDasharray="6 8" />
        <circle cx="300" cy="300" r="160" stroke="rgba(200, 0, 0, 0.5)" strokeWidth="1" />
      </g>

      {/* RING 4: INNER ANNULAR FORGE GLOW */}
      <circle cx="300" cy="300" r="148" fill="url(#hubForgeGrad)" stroke="rgba(255, 138, 61, 0.35)" strokeWidth="1.2" strokeDasharray="4 6" />
    </svg>
  );
}

export default React.memo(HeroRings);
