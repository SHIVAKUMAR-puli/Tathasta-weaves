import HeroLoom from '@/components/HeroLoom';
import Studio from '@/components/Studio';
import Collection from '@/components/Collection';
import Contact from '@/components/Contact';

// TODO: swap in real numbers before launch
const LEDGER = [
  ['12,000+', 'patterns generated'],
  ['38%', 'less dead stock in pilot runs'],
  ['140', 'weavers and mills on the network'],
  ['24 hrs', 'from prompt to sample brief'],
];

const PLATFORM = [
  {
    name: 'Loom Studio',
    status: 'Try it below',
    href: '#studio',
    text: 'Text-to-weave design. Describe a mood in a sentence and get a loom-ready pattern with its palette, in any weave structure.',
  },
  {
    name: 'Forecast',
    status: 'For mill partners',
    href: '#contact',
    text: 'Season, region and search signals roll up into a forecast per design, so mills dye and weave closer to real orders.',
  },
  {
    name: 'Inspect',
    status: 'For mill partners',
    href: '#contact',
    text: 'Camera-based defect detection on the loom. Broken ends, slubs and colour drift get flagged as the cloth comes off.',
  },
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <a className="wordmark" href="#top">Tathasta Weaves</a>
        <nav>
          <a href="#platform">Platform</a>
          <a href="#studio">Studio</a>
          <a href="#fabrics">Fabrics</a>
          <a href="#contact" className="btn">Book a demo</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="label">AI-powered textile technology</p>
            <h1><em>AI&#8209;powered</em> textiles, from first thread to finished bolt.</h1>
            <p className="lead">
              Tathasta Weaves is an AI-first textile company. Our models design the patterns, forecast demand
              and inspect every metre of cloth. Our artisan and mill partners weave it.
            </p>
            <div className="cta">
              <a href="#studio" className="btn">Design a fabric with AI</a>
              <a href="#contact" className="btn ghost">Talk to the team</a>
            </div>
            <ul className="ai-tags" aria-label="What our AI does">
              <li>Generative pattern design</li>
              <li>Demand forecasting</li>
              <li>Computer-vision quality control</li>
            </ul>
          </div>
          <HeroLoom />
        </section>

        <section className="ledger">
          {LEDGER.map(([n, label]) => (
            <div key={label}><strong>{n}</strong><span>{label}</span></div>
          ))}
        </section>

        <section id="platform" className="section">
          <div className="split-head">
            <p className="label">The platform</p>
            <h2>Three tools, one thread running through them.</h2>
            <p>
              Textiles still run on guesswork: which designs will sell, how much yarn to dye, which bolt has a flaw.
              We put a model at each of those decisions and keep the craft in human hands.
            </p>
          </div>
          <div className="platform">
            {PLATFORM.map((p, i) => (
              <a key={p.name} href={p.href} className="module">
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                <span className="status">{p.status} →</span>
              </a>
            ))}
          </div>
        </section>

        <Studio />
        <Collection />
        <Contact />
      </main>

      <footer>
        <span className="wordmark">Tathasta Weaves</span>
        <span>© {new Date().getFullYear()} Tathasta Weaves. Textile intelligence, woven by hand.</span>
      </footer>
    </>
  );
}
