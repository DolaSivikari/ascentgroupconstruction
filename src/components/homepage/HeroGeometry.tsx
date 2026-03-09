/**
 * HeroGeometry — Subtle architectural SVG overlay for hero slides.
 * Renders construction-themed line geometry (section cuts, facade grids,
 * datum marks) as an atmospheric layer.
 */

interface HeroGeometryProps {
  slideIndex: number;
  isFadingOut: boolean;
  prefersReducedMotion: boolean;
}

const HeroGeometry = ({ slideIndex, isFadingOut, prefersReducedMotion }: HeroGeometryProps) => {
  return (
    <div
      className="absolute inset-0 z-[5] pointer-events-none overflow-hidden"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 600ms ease-in-out',
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {slideIndex === 0 && <Slide1Geometry animated={!prefersReducedMotion} />}
        {slideIndex === 1 && <Slide2Geometry animated={!prefersReducedMotion} />}
        {slideIndex === 2 && <Slide3Geometry animated={!prefersReducedMotion} />}
      </svg>

      <style>{`
        @keyframes geo-draw {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes geo-draw-300 {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes geo-draw-400 {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes geo-drift-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes geo-drift-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        @keyframes geo-fade-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.14; }
        }
      `}</style>
    </div>
  );
};

/* ── Slide 1: Building Envelope ── */
function Slide1Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Element A — Section cut line: vertical with horizontal ticks, top-right */}
      <g
        style={{
          opacity: 0.14,
          ...(animated
            ? {
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'geo-draw 3s ease-out forwards',
                animationDelay: '0.5s',
              }
            : {}),
        }}
      >
        <line x1="1580" y1="80" x2="1580" y2="520" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1568" y1="140" x2="1592" y2="140" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1568" y1="260" x2="1592" y2="260" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1568" y1="380" x2="1592" y2="380" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1568" y1="500" x2="1592" y2="500" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Element B — Facade grid fragment: 4x3 curtain wall pattern, right-center */}
      <g style={{ opacity: 0.10 }}>
        <line x1="1650" y1="340" x2="1650" y2="580" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1710" y1="340" x2="1710" y2="580" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1770" y1="340" x2="1770" y2="580" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1830" y1="340" x2="1830" y2="580" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1650" y1="340" x2="1830" y2="340" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1650" y1="420" x2="1830" y2="420" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1650" y1="500" x2="1830" y2="500" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1650" y1="580" x2="1830" y2="580" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Element C — Datum/alignment mark: bottom-right, drifts up */}
      <g
        style={{
          opacity: 0.18,
          ...(animated
            ? { animation: 'geo-drift-up 18s ease-in-out infinite' }
            : {}),
        }}
      >
        <line x1="1500" y1="860" x2="1720" y2="860" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1500" y1="848" x2="1500" y2="872" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1720" y1="848" x2="1720" y2="872" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1610" y1="852" x2="1610" y2="868" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Element D — Diagonal grade/slope reference line */}
      <g style={{ opacity: 0.10 }}>
        <line x1="1500" y1="700" x2="1820" y2="600" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1500" y1="694" x2="1500" y2="706" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1820" y1="594" x2="1820" y2="606" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── Slide 2: Process / Precision ── */
function Slide2Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Right-angle bracket, top-right */}
      <g
        style={{
          opacity: 0.14,
          ...(animated
            ? {
                strokeDasharray: 300,
                strokeDashoffset: 300,
                animation: 'geo-draw-300 2.5s ease-out forwards',
                animationDelay: '0.3s',
              }
            : {}),
        }}
      >
        <polyline points="1700,120 1700,280 1840,280" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="1696" y="272" width="12" height="12" stroke="white" strokeWidth="0.8" fill="none" rx="0" />
      </g>

      {/* Offset measurement ticks, right-center */}
      <g style={{ opacity: 0.10 }}>
        <line x1="1760" y1="440" x2="1760" y2="640" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1748" y1="440" x2="1772" y2="440" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1748" y1="540" x2="1772" y2="540" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1748" y1="640" x2="1772" y2="640" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Alignment crosshair, bottom-right, slight drift */}
      <g
        style={{
          opacity: 0.16,
          ...(animated
            ? { animation: 'geo-drift-right 20s ease-in-out infinite' }
            : {}),
        }}
      >
        <line x1="1580" y1="820" x2="1680" y2="820" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1630" y1="790" x2="1630" y2="850" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <circle cx="1630" cy="820" r="8" stroke="white" strokeWidth="0.8" fill="none" />
      </g>

      {/* Element D — Dimension arrow pair */}
      <g style={{ opacity: 0.10 }}>
        <line x1="1720" y1="700" x2="1820" y2="700" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        {/* Left arrowhead */}
        <polyline points="1726,696 1720,700 1726,704" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Right arrowhead */}
        <polyline points="1814,696 1820,700 1814,704" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* End ticks */}
        <line x1="1720" y1="692" x2="1720" y2="708" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1820" y1="692" x2="1820" y2="708" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── Slide 3: Network / Reach ── */
function Slide3Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Dot cluster with connecting segments, top-right */}
      <g
        style={{
          opacity: 0.14,
          ...(animated
            ? {
                strokeDasharray: 400,
                strokeDashoffset: 400,
                animation: 'geo-draw-400 3s ease-out forwards',
                animationDelay: '0.4s',
              }
            : {}),
        }}
      >
        <line x1="1620" y1="160" x2="1740" y2="200" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1740" y1="200" x2="1800" y2="140" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1740" y1="200" x2="1700" y2="310" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="1700" y1="310" x2="1820" y2="290" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="1620" cy="160" r="2.5" fill="white" />
        <circle cx="1740" cy="200" r="3" fill="white" />
        <circle cx="1800" cy="140" r="2" fill="white" />
        <circle cx="1700" cy="310" r="2.5" fill="white" />
        <circle cx="1820" cy="290" r="2" fill="white" />
      </g>

      {/* Building silhouette fragments, right-center */}
      <g style={{ opacity: 0.08 }}>
        <polyline points="1660,580 1660,460 1700,460 1700,490 1740,490 1740,430 1780,430 1780,580" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Small alignment mark, bottom-right, fade pulse */}
      <g
        style={{
          ...(animated
            ? { animation: 'geo-fade-pulse 12s ease-in-out infinite' }
            : { opacity: 0.08 }),
        }}
      >
        <line x1="1700" y1="880" x2="1800" y2="880" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1700" y1="872" x2="1700" y2="888" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1800" y1="872" x2="1800" y2="888" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Element D — Second smaller building silhouette, offset skyline cluster */}
      <g style={{ opacity: 0.06 }}>
        <polyline points="1800,580 1800,500 1825,500 1825,520 1850,520 1850,470 1875,470 1875,580" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </g>
  );
}

export default HeroGeometry;
