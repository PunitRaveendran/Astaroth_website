import React from 'react';

const TEAM_GROUPS = [
  {
    category: 'Team Leadership',
    members: [
      { name: 'Sneh Sheth', role: 'Team Lead', photo: '/team/sneh.jpg', linkedin: 'https://www.linkedin.com/in/sneh-sheth-988000320/' },
      { name: 'Surya Balakrishnan', role: 'Team Co-Lead / Design Head', photo: '/team/surya.jpg', linkedin: 'https://www.linkedin.com/in/surya-balakrishnan-02a4572b7/' }
    ]
  },
  {
    category: 'Electrical & Telemetry Engineering',
    members: [
      { name: 'Nishaanth S.', role: 'Electrical Head', photo: '/team/nishaanth.jpg', linkedin: 'https://www.linkedin.com/in/nishaanth-sundararajan-a20827334/' },
      { name: 'Punit Raveendran', role: 'Electrical / Media Team', photo: '/team/punit.jpg', linkedin: 'https://www.linkedin.com/in/punit-raveendran-805407321/' },
      { name: 'Rishabh K.', role: 'Electrical Member', photo: '/team/rishabh.jpg', linkedin: 'https://www.linkedin.com/in/rishabh-k-490009356/' },
      { name: 'Gauri Roy', role: 'Electrical Member', photo: '/team/gauri.jpg', linkedin: 'https://www.linkedin.com/in/gauri-roy-4b212b42b/' },
      { name: 'Harini Karthikeyan', role: 'Electrical Member', photo: '/team/harini.jpg', linkedin: 'https://www.linkedin.com/in/harini-karthikeyan-b53b76206/' }
    ]
  },
  {
    category: 'Design & Media Systems',
    members: [
      { name: 'Parth Bajad', role: 'Design Team Member', photo: '/team/parth.jpg', linkedin: 'https://www.linkedin.com/in/parth-bajad-422609359/' },
      { name: 'Anusree Giridhar', role: 'Media / Design Team', photo: '/team/anusree.jpg', linkedin: 'https://www.linkedin.com/in/anusree-giridhar-44883a334/' }
    ]
  },
  {
    category: 'Arena Combat Driver',
    members: [
      { name: 'P. M. Easwardev', role: 'Driver', photo: '/team/easwar.jpg', linkedin: 'https://www.linkedin.com/in/p-m-easwardev-58935b242/' }
    ]
  }
];

export default function Team() {
  return (
    <section className="sec" id="team">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="eyebrow">Engineering Roster</span>
            <h2 className="h">Meet The Team</h2>
            <p className="lead">
              The engineers, designers, and driver behind The Lawnmower's design, manufacturing, and arena performance.
            </p>
          </div>
          {/* Prominent LinkedIn Click Hint */}
          <div className="team-linkedin-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
            </svg>
            <span>CLICK ANY OPERATOR PHOTO TO CONNECT ON LINKEDIN</span>
          </div>
        </div>

        <div id="teamRowsContainer">
          {TEAM_GROUPS.map((grp, gIdx) => (
            <div key={gIdx} className="team-row">
              <div className="team-row-h">
                <span>{grp.category}</span>
              </div>

              <div className="members-grid">
                {grp.members.map((m, mIdx) => (
                  <figure key={mIdx} className="member-card">
                    <a
                      href={m.linkedin || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="member-link"
                      aria-label={'Open ' + m.name + ' LinkedIn Profile'}
                    >
                      <div className="member-ph">
                        {/* Persistent Top-Right LinkedIn Badge on Photo */}
                        <div className="photo-li-tag" title="Open LinkedIn Profile">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                          </svg>
                        </div>

                        {/* Real Photo or Silhouette Icon */}
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="member-real-photo"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center top',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="member-avatar-svg">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}

                        {/* Interactive Hover Overlay */}
                        <div className="member-overlay">
                          <span className="member-li-pill">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                            </svg>
                            VIEW LINKEDIN &rarr;
                          </span>
                        </div>
                      </div>

                      <figcaption>
                        {/* Larger Bold Name */}
                        <b className="member-name-large">{m.name}</b>
                        {/* Tactical Role Badge */}
                        <span className="member-role-badge">{m.role}</span>
                      </figcaption>
                    </a>
                  </figure>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
