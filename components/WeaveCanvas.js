'use client';

import { useEffect, useRef } from 'react';
import { drawWeave } from '@/lib/weave';

export default function WeaveCanvas({ width, height, colors, weave, cell, seed }) {
  const ref = useRef(null);
  useEffect(() => {
    drawWeave(ref.current.getContext('2d'), width, height, { colors, weave, cell, seed });
  }, [width, height, colors, weave, cell, seed]);
  return <canvas ref={ref} width={width} height={height} />;
}
