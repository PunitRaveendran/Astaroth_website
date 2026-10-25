import React, { useState } from 'react';

export default function Navbar({ activeSection = 'hero', scrollPct = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="pbar" id="bar" style={{ transform: 'scaleX(' + scrollPct + ')' }} />
      <nav className="nav" id="mainNav">
        <a className="nav-brand" href="#hero" aria-label="Astaroth Robotics Home">
          <img src="/logo.png" alt="Astaroth Robotics" />
          
        </a>
        <button
          className="menu-btn"
          id="menu"
          aria-expanded={menuOpen}
          aria-controls="navlist"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          MENU
        </button>
        <ul className={'nav-links ' + (menuOpen ? 'open' : '')} id="navlist">
          <li><a href="#hero" className={activeSection === 'hero' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Overview</a></li>
          <li><a href="#robot" className={activeSection === 'robot' ? 'active' : ''} onClick={() => setMenuOpen(false)}>The Battlebot</a></li>
          <li><a href="#sponsors" className={activeSection === 'sponsors' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Sponsors</a></li>
          <li><a href="#team" className={activeSection === 'team' ? 'active' : ''} onClick={() => setMenuOpen(false)}>The Team</a></li>
          <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
        <a href="#contact" className="nav-cta">Sponsor Us &rarr;</a>
      </nav>
    </>
  );
}
