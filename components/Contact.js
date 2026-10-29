'use client';

import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: send this somewhere (email service or an API route)
    setSent(true);
    e.target.reset();
  };

  return (
    <section id="contact" className="section contact">
      <div className="split-head">
        <p className="label">Get in touch</p>
        <h2>Bring us a brief.</h2>
        <p>
          Brands, designers, boutiques and mills. Tell us what you need and we&apos;ll come back within a day
          with a sample brief from the studio.
        </p>
      </div>
      <form className="contact-form" onSubmit={onSubmit}>
        <input required placeholder="Name" aria-label="Name" />
        <input required type="email" placeholder="Email" aria-label="Email" />
        <input placeholder="Company (optional)" aria-label="Company" />
        <textarea rows={4} placeholder="What are you working on?" aria-label="Message" />
        <button className="btn" type="submit">Send brief</button>
        {sent && <p className="note">Thanks. We&apos;ll be in touch within a day.</p>}
      </form>
    </section>
  );
}
