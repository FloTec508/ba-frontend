import { useState, useRef, useCallback, useEffect } from "react";

const MIN = 875;
const MAX = 1080;
const STEP = 1; // 0.1 MHz per unit

const RULER_COLORS = {
  // Canvas ticks
  tickNear: "#ffffff",
  tickSelectedLight: "#f24f34",
  tickSelectedDark: "#f24f34",
  tickDimLight: "#999",
  tickDimDark: "#000000",

  // DOM elements — Tailwind class strings
  fill: "bg-orange-600",
  needle: "border-orange-600",
  labelNear: "text-orange-600",
} as const;

interface TunerRulerProps {
  frequency?: number;
  onChange?: (freq: number) => void;
  onRelease?: (freq: number) => void;
}

function pct(v: number): number {
  return ((v - MIN) / (MAX - MIN)) * 100;
}

function freqFromX(x: number, rect: DOMRect): number {
  const p = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
  return Math.round((MIN + p * (MAX - MIN)) / STEP) * STEP;
}

function drawTicks(canvas: HTMLCanvasElement, freq: number, isDark: boolean): void {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const colorSel = isDark ? RULER_COLORS.tickSelectedDark : RULER_COLORS.tickSelectedLight;
  const colorDim = isDark ? RULER_COLORS.tickDimDark : RULER_COLORS.tickDimLight;
  const fillX = ((freq - MIN) / (MAX - MIN)) * W;
//   const GAP = 3;

  //   ctx.strokeStyle = colorSel;
  //   ctx.lineWidth = 1.5;
  //   ctx.beginPath();
  //   ctx.moveTo(0, H / 2);
  //   ctx.lineTo(fillX - GAP, H / 2);
  //   ctx.stroke();

  //   ctx.strokeStyle = colorDim;
  //   ctx.beginPath();
  //   ctx.moveTo(fillX + GAP, H / 2);
  //   ctx.lineTo(W, H / 2);
  //   ctx.stroke();

  for (let t = MIN + STEP; t <= MAX; t += STEP * 2) {
    const x = ((t - MIN) / (MAX - MIN)) * W;
    const isMajor = t % 20 === 0;
    const isMid = !isMajor && t % 10 === 0;
    const isSemi = !isMajor && !isMid && t % 4 === 0;
    const sel = t <= freq;
    const heightFrac = isMajor ? 0.5 : isMid ? 0.4 : isSemi ? 0.22 : 0.22;
    const h = H * heightFrac;
    const y = (H - h) / 2;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = sel ? colorSel : colorDim;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();
  }

  const majorH = H * 0.6;
  const majorY = (H - majorH) / 2;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fillX, majorY);
  ctx.lineTo(fillX, majorY + majorH);
  ctx.stroke();
}

export default function Ruler({ frequency = 1035, onChange, onRelease }: TunerRulerProps) {
  const [freq, setFreq] = useState<number>(frequency);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<boolean>(false);
  const isDark = useRef<boolean>(window.matchMedia("(prefers-color-scheme: dark)").matches);

  const update = useCallback(
    (val: number) => {
      setFreq(val);
      onChange?.(val);
    },
    [onChange],
  );

  const freqRef = useRef<number>(freq);

  useEffect(() => {
    freqRef.current = freq;
  }, [freq]);

  useEffect(() => {
    setFreq(frequency);
  }, [frequency]);

  const getFreqFromEvent = useCallback((clientX: number): number => {
    if (!trackRef.current) return MIN;
    return freqFromX(clientX, trackRef.current.getBoundingClientRect());
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      update(getFreqFromEvent(e.clientX));
    },
    [update, getFreqFromEvent],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      dragging.current = true;
      update(getFreqFromEvent(e.touches[0].clientX));
    },
    [update, getFreqFromEvent],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      update(getFreqFromEvent(e.clientX));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      update(getFreqFromEvent(e.touches[0].clientX));
    };
    const onUp = () => {
      if (!dragging.current) return; // ← only fire if actually dragging
      dragging.current = false;
      onRelease?.(freqRef.current); // ← always has latest value
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [update, getFreqFromEvent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawTicks(canvas, freq, isDark.current);
  }, [freq]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      drawTicks(canvas, freq, isDark.current);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [freq]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      isDark.current = e.matches;
      if (canvasRef.current) drawTicks(canvasRef.current, freq, e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [freq]);

  const needlePct = pct(freq);
  const majorTicks = Array.from({ length: Math.floor((MAX - MIN) / 20) + 1 }, (_, i) => MIN + i * 20).filter((t) => t <= MAX);

  return (
    <div className="w-full select-none mb-5">
      <div ref={trackRef} className="relative h-16 cursor-pointer" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" />

        <div
          className={`absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 ${RULER_COLORS.needle} z-10`}
          style={{ left: `${needlePct}%` }}
        />
      </div>

      <div className="relative h-5">
        {majorTicks.map((t) => {
          return (
            <div key={t} className="absolute -translate-x-1/2" style={{ left: `${pct(t)}%` }}>
              <span className={`text-sm`}>{(t / 10).toFixed(0)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
