import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('roboticsastaroth@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setStatus('error');
      setStatusMsg('Please fill out all required fields.');
      return;
    }

    setStatus('sending');
    setStatusMsg('Transmitting directly to team inbox...');

    try {
      const formPayload = new FormData();
      formPayload.append('access_key', '7db90055-e1da-4d53-acfb-7741e97315e6');
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('message', formData.message);
      formPayload.append('subject', `Astaroth Robotics Inquiry - ${formData.name}`);
      formPayload.append('to_email', 'roboticsastaroth@gmail.com');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formPayload,
        headers: { Accept: 'application/json' }
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setStatusMsg('✓ Inquiry Sent Successfully! We have received your message and will reply shortly.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      console.warn('Direct send failed, opening mail client', err);
      const bodyText = `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`;
      const mailto = `mailto:roboticsastaroth@gmail.com?subject=${encodeURIComponent('Astaroth Robotics Inquiry - ' + formData.name)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailto;
      setStatus('success');
      setStatusMsg('✓ Opened in your email client for roboticsastaroth@gmail.com');
    }
  };

  return (
    <section className="sec" id="contact">
      <div className="wrap contact-wrap">
        <div className="sec-head contact-head">
          <div>
            <span className="eyebrow">Direct Contact</span>
            <h2 className="h">Put Your Name On The Next Build</h2>
            <p className="lead">
              Interested in sponsoring Astaroth, providing parts or machining, or hosting us? Reach out directly to our team.
            </p>
          </div>
        </div>

        <div className="cgrid">
          {/* Left Column: Team HQ & Comms */}
          <div className="cinfo">
            <div>
              <span className="eyebrow">Team Headquarters</span>
              <p className="cinfo-lead">
                Team Astaroth is a student robot combat team. We design, machine, wire, and drive our own robots, putting them to the test in arenas nationwide.
              </p>
            </div>

            <dl className="cinfo-dl">
              <div>
                <dt>Direct Email</dt>
                <dd>
                  <a href="mailto:roboticsastaroth@gmail.com" className="cinfo-mail">roboticsastaroth@gmail.com</a>
                  <button type="button" className="copy-pill" id="copyMail" onClick={handleCopy}>
                    {copied ? 'COPIED!' : 'COPY'}
                  </button>
                </dd>
              </div>

              <div>
                <dt>Connect With Us</dt>
                <dd className="social-links">
                  <a href="https://www.instagram.com/astarothrobotics?srtk=ampoOXZhY3N5cDls" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://in.linkedin.com/in/astaroth-robotics-8b8904446" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Generous, Full-Width Dark Form Card */}
          <form className="cform" id="cform" onSubmit={handleSubmit}>
            <label>
              <span>Your Name / Organization <span className="req" style={{ color: 'var(--laser)' }}>*</span></span>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name or Organization"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </label>

            <label>
              <span>Direct Contact Email <span className="req" style={{ color: 'var(--laser)' }}>*</span></span>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>

            <label>
              <span>Transmission Details <span className="req" style={{ color: 'var(--laser)' }}>*</span></span>
              <textarea
                name="message"
                rows={6}
                required
                placeholder="Write your message or inquiry here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </label>

            <button type="submit" className="btn btn-primary btn-inquiry" disabled={status === 'sending'}>
              {status === 'sending' ? 'Transmitting...' : 'Send Inquiry →'}
            </button>

            {statusMsg && (
              <div
                className="fstatus-box"
                style={{
                  color: status === 'error' ? 'var(--laser)' : status === 'success' ? '#4ade80' : 'var(--title-gold)'
                }}
              >
                {statusMsg}
              </div>
            )}
          </form>
        </div>

        <footer>
          <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ color: 'var(--gold)', marginBottom: 0 }}>ROBOT COMBAT TEAM</span>
            <span className="footer-brand-title" style={{ color: 'var(--bone)', letterSpacing: '0.06em', fontWeight: 700 }}>ASTAROTH ROBOTICS &bull; THE LAWNMOWER</span>
          </div>
          <span>ENGINEERED FOR THE ARENA &bull; 2026</span>
        </footer>
      </div>
    </section>
  );
}
