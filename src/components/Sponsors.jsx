import React, { useState, useRef } from 'react';

const SPONSORS_DATA = {
  title: [
    {
      name: 'Title Partner Slot',
      industry: 'Open for Title Sponsorship',
      desc: 'Headline branding on Astaroth\'s chassis, team uniforms, pit displays, competition streams, and official press releases.',
      help: 'Primary title sponsorship, solid billet monocoque chassis machining, and multi-axis tooling allocation.'
    }
  ],
  gold: [
    {
      name: 'Gold Partner Slot 01',
      industry: 'Powertrain & Electronics',
      desc: 'High-visibility branding across robot exterior panels, team media deck, and competition pit displays.',
      help: 'High-current 120A brushless drive pods, precision planetary gearboxes, and dead-axle steel keyed shafts.'
    },
    {
      name: 'Gold Partner Slot 02',
      industry: 'Armor & Metallurgy',
      desc: 'High-visibility branding across robot exterior panels, team media deck, and competition pit displays.',
      help: 'Hardox 500 monocoque abrasion plating, top deck armor sheets, and laser-profiled wedge teeth.'
    }
  ],
  silver: [
    {
      name: 'Silver Partner Slot 01',
      industry: 'Power Storage & Systems',
      desc: 'Featured logo placement on team portal, pit banner, and competition documentation.',
      help: 'Competition-grade high-discharge battery vault packs and rapid cell balancing telemetry.'
    },
    {
      name: 'Silver Partner Slot 02',
      industry: 'Mechanical Transmission',
      desc: 'Featured logo placement on team portal, pit banner, and competition documentation.',
      help: 'Weapon synchronization belts, custom timing pulleys, and arena traction drive hubs.'
    }
  ],
  bronze: [
    {
      name: 'Bronze Partner Slot',
      industry: 'Rapid Prototyping & Fabrication',
      desc: 'Logo placement on our official team site, tournament banners, and engineering decks.',
      help: 'Internal electronics isolation mounts, wire harness conduit, and rapid test mockups.'
    }
  ],
  community: [
    {
      name: 'Community Partner Slot',
      industry: 'Open for Community & Collegiate Partners',
      desc: 'Collaborative partnership supporting testing infrastructure, collegiate robotics events, and technical workshops.',
      help: 'Testing facility support, arena trial infrastructure, and collegiate ecosystem backing.'
    }
  ]
};

const TIERS = [
  ['title', 'Title Partner', 'Lead title sponsor'],
  ['gold', 'Gold Partners', 'Gold tier sponsors'],
  ['silver', 'Silver Partners', 'Silver tier sponsors'],
  ['bronze', 'Bronze Partner', 'Bronze tier sponsor'],
  ['community', 'Community Partner', 'Community ecosystem sponsor']
];

export default function Sponsors() {
  const [activeDuo, setActiveDuo] = useState({});
  const leaveTimers = useRef({});

  const handleCardEnter = (tierKey, idx) => {
    if (leaveTimers.current[tierKey]) {
      clearTimeout(leaveTimers.current[tierKey]);
      delete leaveTimers.current[tierKey];
    }
    setActiveDuo(prev => {
      if (prev[tierKey] === idx) return prev;
      return { ...prev, [tierKey]: idx };
    });
  };

  const handleGridLeave = (tierKey) => {
    if (leaveTimers.current[tierKey]) {
      clearTimeout(leaveTimers.current[tierKey]);
    }
    leaveTimers.current[tierKey] = setTimeout(() => {
      setActiveDuo(prev => ({ ...prev, [tierKey]: null }));
      delete leaveTimers.current[tierKey];
    }, 130);
  };

  const handleGridEnter = (tierKey) => {
    if (leaveTimers.current[tierKey]) {
      clearTimeout(leaveTimers.current[tierKey]);
      delete leaveTimers.current[tierKey];
    }
  };

  return (
    <section className="sec" id="sponsors">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Official Partners</span>
            <h2 className="h">The Names Behind The Build</h2>
            <p className="lead">
              Our sponsors put Astaroth into the arena. Hover over any partner card to inspect sponsorship allocations.
            </p>
          </div>
          <a className="btn" href="#contact">Become A Sponsor</a>
        </div>

        <div id="tiersContainer">
          {TIERS.map(([k, label]) => {
            const list = SPONSORS_DATA[k] || [];
            if (!list.length) return null;
            const isDuo = list.length === 2;
            const gridClass = isDuo ? 'sgrid-duo is-js-ready' : 'sgrid-single';

            return (
              <div key={k} className={`tier t-${k}`}>
                <h3 className="tier-h">
                  {label}
                  <small>{list.length} {list.length > 1 ? 'partners' : 'partner'}</small>
                </h3>

                <div 
                  className={gridClass}
                  onMouseEnter={isDuo ? () => handleGridEnter(k) : undefined}
                  onMouseLeave={isDuo ? () => handleGridLeave(k) : undefined}
                >
                  {list.map((s, idx) => {
                    const sideClass = isDuo ? (idx === 0 ? 'sp-left' : 'sp-right') : 'sp-lead';
                    const activeIdx = activeDuo[k];
                    const isActive = isDuo && activeIdx === idx;
                    const isShrunk = isDuo && activeIdx !== null && activeIdx !== undefined && activeIdx !== idx;
                    const stateClass = isActive ? 'is-active' : (isShrunk ? 'is-shrunk' : '');

                    return (
                      <article
                        key={idx}
                        className={`sp ${sideClass} ${stateClass}`}
                        tabIndex={0}
                        onMouseEnter={isDuo ? () => handleCardEnter(k, idx) : undefined}
                        onFocus={isDuo ? () => handleCardEnter(k, idx) : undefined}
                        onBlur={isDuo ? () => handleGridLeave(k) : undefined}
                      >
                        <div className="sp-inner">
                          <div className="sp-brand">
                            <div className="sp-logo-box">
                              <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
                                <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" opacity="0.6"/>
                                <path d="M24 16v16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                              </svg>
                            </div>
                            <div className="sp-brand-text">
                              <span className="sp-tier-tag">{s.industry}</span>
                              <h4 className="sp-name">{s.name}</h4>
                            </div>
                          </div>

                          <div className="sp-drawer">
                            <div className="sp-drawer-content">
                              <div className="sp-meta-badge">OFFICIAL TECHNICAL PARTNER</div>
                              <p className="sp-desc">{s.desc}</p>
                              <div className="sp-contrib">
                                <span className="sp-contrib-lbl">MISSION CONTRIBUTION:</span> {s.help}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
