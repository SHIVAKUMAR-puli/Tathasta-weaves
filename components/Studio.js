'use client';

import { useEffect, useRef, useState } from 'react';
import { buildPalette, drawWeave, hash } from '@/lib/weave';

const SIZE = 640;
const WEAVES = [
  ['twill', 'Twill'],
  ['herringbone', 'Herringbone'],
  ['plaid', 'Plaid / check'],
  ['ikat', 'Ikat-inspired'],
  ['plain', 'Plain weave'],
];

export default function Studio() {
  const canvasRef = useRef(null);
  const [prompt, setPrompt] = useState('monsoon evening over indigo hills, calm and earthy');
  const [weave, setWeave] = useState('twill');
  const [density, setDensity] = useState(24);
  // prompt only applies on Generate; variation bumps so each press gives a new take
  const [submitted, setSubmitted] = useState({ prompt, variation: 0 });
  const [result, setResult] = useState({ colors: [], matched: true });

  useEffect(() => {
    const text = submitted.prompt.trim() || 'untitled weave';
    const palette = buildPalette(text, submitted.variation);
    const seed = hash(text + weave + submitted.variation);
    drawWeave(canvasRef.current.getContext('2d'), SIZE, SIZE, {
      colors: palette.colors, weave, cell: Math.round(SIZE / (density * 1.6)) || 8, seed,
    });
    setResult(palette);
  }, [submitted, weave, density]);

  const generate = () => setSubmitted((s) => ({ prompt, variation: s.variation + 1 }));

  const download = () => {
    const a = document.createElement('a');
    a.download = 'tathasta-weave.png';
    a.href = canvasRef.current.toDataURL('image/png');
    a.click();
  };

  return (
    <section id="studio" className="section alt">
      <div className="split-head">
        <p className="label">01 / Loom Studio</p>
        <h2>Write a sentence. Get a weave.</h2>
        <p>
          Describe the feeling you want. The model reads the mood, picks a palette and lays it into the weave
          structure you choose. Press generate again and it tries another take.
        </p>
      </div>
      <div className="studio">
        <div className="panel">
          <label htmlFor="prompt">Prompt</label>
          <textarea id="prompt" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. monsoon evening over indigo hills, calm and earthy" />

          <label htmlFor="weave">Weave structure</label>
          <select id="weave" value={weave} onChange={(e) => setWeave(e.target.value)}>
            {WEAVES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>

          <label htmlFor="density">Thread density <output>{density} epi</output></label>
          <input type="range" id="density" min={10} max={48} value={density} onChange={(e) => setDensity(+e.target.value)} />

          <div className="cta">
            <button className="btn" onClick={generate}>Generate</button>
            <button className="btn ghost" onClick={download}>Download PNG</button>
          </div>

          <p className="label palette-label">Palette</p>
          <div className="palette">
            {result.colors.map((c, i) => <span key={i} style={{ background: c }} title={c} />)}
          </div>
          <p className="note">
            {result.matched
              ? 'Palette read from the mood of your prompt.'
              : 'Nothing in that prompt gave us a strong colour cue, so the model improvised. Try words like indigo, festive or earthy.'}
          </p>
        </div>
        <div className="canvas-wrap"><canvas ref={canvasRef} id="studioCanvas" width={SIZE} height={SIZE} /></div>
      </div>
    </section>
  );
}
