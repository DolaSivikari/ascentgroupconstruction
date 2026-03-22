/**
 * HeroGeometry — Subtle architectural SVG overlay for hero slides.
 * Renders construction-themed line geometry (section cuts, facade grids,
 * datum marks) as an atmospheric layer spread across the full viewport.
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
        {slideIndex === 3 && <Slide4Geometry animated={!prefersReducedMotion} />}
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
          0%, 100% { opacity: 0.20; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
};

/* ── Slide 1: Building Envelope ── */
function Slide1Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* A — Section cut line: vertical with ticks, TOP-LEFT */}
      <g
        style={{
          opacity: 0.35,
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
        <line x1="120" y1="80" x2="120" y2="520" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="140" x2="132" y2="140" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="260" x2="132" y2="260" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="380" x2="132" y2="380" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="500" x2="132" y2="500" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* B — Facade grid fragment: 4x3 curtain wall, RIGHT-CENTER (keep) */}
      <g style={{ opacity: 0.25 }}>
        <line x1="1650" y1="340" x2="1650" y2="580" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1710" y1="340" x2="1710" y2="580" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1770" y1="340" x2="1770" y2="580" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1830" y1="340" x2="1830" y2="580" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1650" y1="340" x2="1830" y2="340" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1650" y1="420" x2="1830" y2="420" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1650" y1="500" x2="1830" y2="500" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1650" y1="580" x2="1830" y2="580" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* C — Datum/alignment mark: BOTTOM-LEFT, drifts up */}
      <g
        style={{
          opacity: 0.40,
          ...(animated
            ? { animation: 'geo-drift-up 18s ease-in-out infinite' }
            : {}),
        }}
      >
        <line x1="200" y1="920" x2="420" y2="920" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="200" y1="908" x2="200" y2="932" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="420" y1="908" x2="420" y2="932" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="310" y1="912" x2="310" y2="928" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* D — Diagonal grade/slope reference line, RIGHT (keep) */}
      <g style={{ opacity: 0.25 }}>
        <line x1="1500" y1="700" x2="1820" y2="600" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1500" y1="694" x2="1500" y2="706" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1820" y1="594" x2="1820" y2="606" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* E — Corner bracket, BOTTOM-RIGHT */}
      <g style={{ opacity: 0.30 }}>
        <line x1="1750" y1="950" x2="1750" y2="900" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="1750" y1="900" x2="1850" y2="900" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <rect x="1746" y="896" width="8" height="8" stroke="white" strokeWidth="1.5" fill="none" />
      </g>

      {/* F — Horizontal datum, LEFT-CENTER (low opacity, near text zone) */}
      <g style={{ opacity: 0.15 }}>
        <line x1="80" y1="540" x2="350" y2="540" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="532" x2="80" y2="548" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="350" y1="532" x2="350" y2="548" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="215" y1="534" x2="215" y2="546" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── Slide 2: Process / Precision ── */
function Slide2Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Right-angle bracket, TOP-LEFT */}
      <g
        style={{
          opacity: 0.35,
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
        <polyline points="100,120 100,280 240,280" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="96" y="272" width="12" height="12" stroke="white" strokeWidth="1.5" fill="none" rx="0" />
      </g>

      {/* Offset measurement ticks, RIGHT-CENTER (keep) */}
      <g style={{ opacity: 0.25 }}>
        <line x1="1760" y1="440" x2="1760" y2="640" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1748" y1="440" x2="1772" y2="440" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1748" y1="540" x2="1772" y2="540" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1748" y1="640" x2="1772" y2="640" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Alignment crosshair, BOTTOM-LEFT, slight drift */}
      <g
        style={{
          opacity: 0.35,
          ...(animated
            ? { animation: 'geo-drift-right 20s ease-in-out infinite' }
            : {}),
        }}
      >
        <line x1="250" y1="850" x2="350" y2="850" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="300" y1="820" x2="300" y2="880" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="300" cy="850" r="8" stroke="white" strokeWidth="1.5" fill="none" />
      </g>

      {/* Dimension arrow pair, RIGHT (keep) */}
      <g style={{ opacity: 0.25 }}>
        <line x1="1720" y1="700" x2="1820" y2="700" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <polyline points="1726,696 1720,700 1726,704" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <polyline points="1814,696 1820,700 1814,704" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="1720" y1="692" x2="1720" y2="708" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1820" y1="692" x2="1820" y2="708" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* E — Small grid fragment, LEFT-CENTER (low opacity, near text zone) */}
      <g style={{ opacity: 0.15 }}>
        <line x1="80" y1="500" x2="80" y2="620" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="500" x2="140" y2="620" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="200" y1="500" x2="200" y2="620" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="500" x2="200" y2="500" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="560" x2="200" y2="560" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="620" x2="200" y2="620" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── Slide 3: Network / Reach ── */
function Slide3Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Dot cluster — split: left group TOP-LEFT */}
      <g
        style={{
          opacity: 0.35,
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
        {/* Left cluster */}
        <line x1="120" y1="160" x2="240" y2="200" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="240" y1="200" x2="300" y2="140" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="240" y1="200" x2="200" y2="310" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="120" cy="160" r="3.5" fill="white" />
        <circle cx="240" cy="200" r="4" fill="white" />
        <circle cx="300" cy="140" r="3" fill="white" />
        <circle cx="200" cy="310" r="3.5" fill="white" />

        {/* Right cluster */}
        <line x1="1700" y1="180" x2="1820" y2="220" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1820" y1="220" x2="1780" y2="310" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="1700" cy="180" r="3" fill="white" />
        <circle cx="1820" cy="220" r="3.5" fill="white" />
        <circle cx="1780" cy="310" r="3" fill="white" />
      </g>

      {/* Building silhouette fragments, RIGHT-CENTER (keep) */}
      <g style={{ opacity: 0.20 }}>
        <polyline points="1660,580 1660,460 1700,460 1700,490 1740,490 1740,430 1780,430 1780,580" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* Alignment mark (pulsing), BOTTOM-LEFT */}
      <g
        style={{
          ...(animated
            ? { animation: 'geo-fade-pulse 12s ease-in-out infinite' }
            : { opacity: 0.20 }),
        }}
      >
        <line x1="150" y1="900" x2="250" y2="900" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="892" x2="150" y2="908" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="250" y1="892" x2="250" y2="908" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Second building silhouette, LEFT-CENTER (low opacity, near text zone) */}
      <g style={{ opacity: 0.15 }}>
        <polyline points="80,610 80,530 105,530 105,550 130,550 130,500 155,500 155,610" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      {/* E — Connecting line across top, subtle span */}
      <g style={{ opacity: 0.12 }}>
        <line x1="300" y1="200" x2="1600" y2="200" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="300" y1="194" x2="300" y2="206" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1600" y1="194" x2="1600" y2="206" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── Slide 4: Credentials / Documentation ── */
function Slide4Geometry({ animated }: { animated: boolean }) {
  return (
    <g>
      {/* Shield outline, TOP-LEFT */}
      <g
        style={{
          opacity: 0.35,
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
        <path
          d="M130,100 L130,220 Q130,280 180,310 Q230,280 230,220 L230,100 Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="180" y1="160" x2="180" y2="240" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="200" x2="210" y2="200" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Document lines, RIGHT-CENTER */}
      <g style={{ opacity: 0.25 }}>
        <rect x="1700" y="400" width="120" height="160" stroke="white" strokeWidth="1.5" fill="none" rx="2" />
        <line x1="1720" y1="430" x2="1800" y2="430" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1720" y1="455" x2="1790" y2="455" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1720" y1="480" x2="1780" y2="480" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1720" y1="505" x2="1795" y2="505" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="1720" y1="530" x2="1770" y2="530" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Checkmark, BOTTOM-LEFT, drifts */}
      <g
        style={{
          opacity: 0.40,
          ...(animated
            ? { animation: 'geo-drift-up 16s ease-in-out infinite' }
            : {}),
        }}
      >
        <polyline points="220,880 240,905 280,860" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="250" cy="885" r="30" stroke="white" strokeWidth="1.5" fill="none" />
      </g>

      {/* Horizontal datum, RIGHT-BOTTOM */}
      <g style={{ opacity: 0.20 }}>
        <line x1="1600" y1="750" x2="1820" y2="750" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1600" y1="742" x2="1600" y2="758" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1820" y1="742" x2="1820" y2="758" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1710" y1="744" x2="1710" y2="756" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Small grid, LEFT-CENTER (low opacity near text) */}
      <g style={{ opacity: 0.15 }}>
        <line x1="80" y1="520" x2="80" y2="600" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="520" x2="120" y2="600" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="160" y1="520" x2="160" y2="600" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="520" x2="160" y2="520" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="560" x2="160" y2="560" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="80" y1="600" x2="160" y2="600" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default HeroGeometry;
