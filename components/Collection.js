import WeaveCanvas from '@/components/WeaveCanvas';
import { FABRICS, fabricColors } from '@/lib/fabrics';

export default function Collection() {
  return (
    <section id="fabrics" className="section alt">
      <div className="split-head">
        <p className="label">The catalogue</p>
        <h2>Cloth we weave today.</h2>
        <p>Every design starts in Loom Studio and is finished on the loom by our partner weavers.</p>
      </div>
      <div className="grid">
        {FABRICS.map((f, i) => (
          <article className="fabric" key={f.name}>
            <WeaveCanvas width={320} height={200} colors={fabricColors(f)} weave={f.weave} cell={8} seed={i * 77 + 3} />
            <h3>{f.name}</h3>
            <p>{f.desc}</p>
            <p className="use">{f.use}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
