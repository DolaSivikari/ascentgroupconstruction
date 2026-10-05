import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Card } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ExplorerTabs } from "@/pages/redesign/ExplorerTabs";
import {
  RECORD_SHEETS,
  RECORD_TOOLS,
  WALL_ASSEMBLIES,
} from "../interactive-data";
import { FloorPlan, WallDetail } from "./Drawings";
import { SampleDocument, SampleLabel } from "./SampleDocuments";

function WindowFace({
  width,
  height,
  storefront,
}: {
  width: number;
  height: number;
  storefront: boolean;
}) {
  const count = Math.max(1, Math.floor(width / (storefront ? 60 : 40)));
  const spacing = width / count;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} 30`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const x = i * spacing + (storefront ? 3 : 10),
          w = spacing - (storefront ? 6 : 20);
        return (
          <g key={i}>
            <rect
              x={x}
              y={storefront ? 5 : 7}
              width={w}
              height={storefront ? 25 : 17}
              fill="hsl(var(--primary) / .55)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1.5"
            />
            <path
              d={`M${x + w / 2} ${storefront ? 5 : 7}V${storefront ? 30 : 24}`}
              stroke="hsl(var(--background))"
              strokeWidth="1.1"
            />
            <path
              d={`M${x - 2} 25H${x + w + 2}`}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
            />
            {storefront && (
              <path d={`M${x} 13H${x + w}`} stroke="hsl(var(--background))" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** A physical six-face box in drawing coordinates, with Z representing height. */
function Box({
  width: w,
  depth: d,
  height: h,
  className = "",
  top,
  style,
}: {
  width: number;
  depth: number;
  height: number;
  className?: string;
  top?: ReactNode;
  style?: CSSProperties;
}) {
  const faces = [
    {
      width: w,
      height: d,
      transform: `translate3d(${-w / 2}px,${-d / 2}px,${h}px)`,
      content: top,
    },
    {
      width: w,
      height: d,
      transform: `translate(${-w / 2}px,${-d / 2}px) rotateX(180deg)`,
    },
    {
      width: w,
      height: h,
      transform: `translate3d(${-w / 2}px,${d / 2 - h / 2}px,${h / 2}px) rotateX(-90deg)`,
    },
    {
      width: w,
      height: h,
      transform: `translate3d(${-w / 2}px,${-d / 2 - h / 2}px,${h / 2}px) rotateX(90deg)`,
    },
    {
      width: d,
      height: h,
      transform: `translate3d(${w / 2 - d / 2}px,${-h / 2}px,${h / 2}px) rotateZ(-90deg) rotateX(-90deg)`,
    },
    {
      width: d,
      height: h,
      transform: `translate3d(${-w / 2 - d / 2}px,${-h / 2}px,${h / 2}px) rotateZ(90deg) rotateX(-90deg)`,
    },
  ];
  return (
    <div className={`tech-box ${className}`} style={style}>
      {faces.map((face, i) => (
        <div
          key={i}
          className={`tech-face ${i > 1 && className.includes("building") ? "tech-wall-face" : ""}`}
          style={{
            width: face.width,
            height: face.height,
            transform: face.transform,
          }}
        >
          {face.content}
          {i > 1 && className.includes("building") && (
            <WindowFace
              width={face.width}
              height={face.height}
              storefront={className.includes("storefront")}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function BlueprintModel({
  progress,
  exploded,
}: {
  progress: number;
  exploded: boolean;
}) {
  const floors = Math.max(0, ((progress - 42) / 58) * 5);
  const rectangles = [
    { x: -50, y: -75, w: 300, d: 130 },
    { x: 140, y: -30, w: 80, d: 40 },
    { x: 115, y: 50, w: 130, d: 120 },
  ];
  return (
    <>
      <div
        style={{ transform: "translateZ(-4px)", transformStyle: "preserve-3d" }}
      >
        <FloorPlan />
      </div>
      {Array.from({ length: 5 }, (_, floor) => {
        const growth = Math.min(1, Math.max(0, floors - floor));
        return (
          growth > 0 &&
          rectangles.map((r, part) => (
            <div
              className="tech-model-part"
              key={`${floor}-${part}`}
              style={{
                transform: `translate3d(${r.x}px,${r.y}px,${floor * (exploded ? 48 : 30)}px)`,
              }}
            >
              <Box
                width={r.w}
                depth={r.d}
                height={Math.max(0.5, growth * 30 - 2)}
                className={`tech-building ${floor === 0 ? "tech-storefront" : ""}`}
              />
              <Box
                width={r.w + 2}
                depth={r.d + 2}
                height={2}
                style={{ transform: `translateZ(${growth * 30 - 2}px)` }}
              />
            </div>
          ))
        );
      })}
      {floors >= 5 && (
        <>
          {[
            [-50, -140, 300, 2],
            [100, -95, 2, 90],
            [140, -50, 80, 2],
            [180, 30, 2, 160],
            [115, 110, 130, 2],
            [50, 50, 2, 120],
            [-75, -10, 250, 2],
            [-200, -75, 2, 130],
          ].map(([x, y, w, d], i) => (
            <Box
              key={i}
              width={w}
              depth={d}
              height={6}
              style={{
                transform: `translate3d(${x}px,${y}px,${exploded ? 242 : 152}px)`,
              }}
            />
          ))}
          <Box
            width={85}
            depth={45}
            height={22}
            className="tech-roof-face"
            style={{
              transform: `translate3d(74px,-29px,${exploded ? 258 : 152}px)`,
            }}
          />
          <Box
            width={35}
            depth={22}
            height={12}
            style={{
              transform: `translate3d(-120px,-75px,${exploded ? 255 : 152}px)`,
            }}
          />
        </>
      )}
    </>
  );
}

export default function InteractiveModels() {
  const rm = useReducedMotion();
  const [view, setView] = useState("blueprint");
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, z: 0 });
  const [scale, setScale] = useState(0.8);
  const [assembly, setAssembly] = useState("eifs");
  const [layer, setLayer] = useState(5);
  const [tool, setTool] = useState(0);
  const [sheet, setSheet] =
    useState<(typeof RECORD_SHEETS)[number]["id"]>("takeoff");
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; rotation: typeof rotation }>();
  const animationStart = useRef(0);
  const animationProgress = useRef(0);

  useEffect(() => {
    const viewer = ref.current;
    if (!viewer) return;
    const resize = new ResizeObserver(([entry]) =>
      setScale(Math.min(0.95, entry.contentRect.width / 680)),
    );
    resize.observe(viewer);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    observer.observe(viewer);
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    return () => {
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);

  useEffect(() => {
    if (!playing || rm) return;
    let frame: number;
    const tick = (now: number) => {
      if (!animationStart.current) animationStart.current = now;
      const value = Math.min(
        100,
        animationProgress.current + (now - animationStart.current) / 110,
      );
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, rm]);

  const selectView = (next: string) => {
    setPlaying(false);
    setView(next);
    setRotation({ x: 0, z: 0 });
    setExploded(false);
  };
  const play = () => {
    if (rm) {
      setProgress(100);
      return;
    }
    animationProgress.current = progress >= 100 ? 0 : progress;
    animationStart.current = 0;
    setPlaying(true);
  };
  const tilt =
    view === "blueprint"
      ? Math.min(60, Math.max(0, ((progress - 24) / 18) * 60))
      : 58;
  const spin =
    view === "blueprint"
      ? -Math.min(25, Math.max(0, ((progress - 24) / 18) * 25))
      : -25;
  const wall = WALL_ASSEMBLIES[assembly];
  const stage = progress < 24 ? 0 : progress < 42 ? 1 : 2;
  const currentTool = RECORD_TOOLS[tool];

  return (
    <ExplorerTabs
      label="Interactive construction models"
      options={[
        { id: "blueprint", label: "Blueprint to 3D" },
        { id: "wall", label: "Stucco & EIFS wall section" },
        { id: "record", label: "Project record" },
      ]}
      value={view}
      onChange={selectView}
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card className="min-w-0 self-start overflow-hidden p-0">
          <div
            ref={ref}
            role="application"
            aria-label="Construction model. Drag horizontally to rotate; arrow keys rotate and tilt."
            tabIndex={0}
            className="tech-viewer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              drag.current = { x: e.clientX, y: e.clientY, rotation };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              const dx = e.clientX - drag.current.x,
                dy = e.clientY - drag.current.y;
              if (Math.abs(dx) > 5) e.currentTarget.style.touchAction = "none";
              setRotation({
                z: drag.current.rotation.z + dx * 0.4,
                x: Math.max(
                  -50,
                  Math.min(30, drag.current.rotation.x - dy * 0.25),
                ),
              });
            }}
            onPointerUp={(e) => {
              drag.current = undefined;
              e.currentTarget.style.touchAction = "pan-y";
            }}
            onPointerCancel={() => {
              drag.current = undefined;
            }}
            onKeyDown={(e) => {
              if (
                !(e.target === e.currentTarget) ||
                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key,
                )
              )
                return;
              e.preventDefault();
              setRotation((r) => ({
                z:
                  r.z +
                  (e.key === "ArrowLeft"
                    ? -10
                    : e.key === "ArrowRight"
                      ? 10
                      : 0),
                x: Math.max(
                  -50,
                  Math.min(
                    30,
                    r.x +
                      (e.key === "ArrowUp"
                        ? -5
                        : e.key === "ArrowDown"
                          ? 5
                          : 0),
                  ),
                ),
              }));
            }}
          >
            <div className="absolute left-3 top-3 z-10 tech-control-label">
              {view === "blueprint"
                ? "A-101 · FLOOR PLAN"
                : view === "wall"
                  ? "A-501 · WALL SECTION"
                  : "PROJECT DRAWING SET"}
            </div>
            <div className="absolute right-3 top-3 z-10 tech-control-label">
              DRAG TO ROTATE
            </div>
            <div
              className="tech-world"
              style={{
                transform: `scale(${scale}) rotateX(${tilt + rotation.x}deg) rotateZ(${spin + rotation.z}deg)`,
              }}
            >
              {view === "blueprint" && (
                <BlueprintModel progress={progress} exploded={exploded} />
              )}
              {view === "wall" &&
                wall.layers.map((item, i) => (
                  <button
                    type="button"
                    aria-label={`Select 3D layer: ${item.name}`}
                    aria-pressed={layer === i}
                    onClick={() => setLayer(i)}
                    className={`tech-model-part ${layer === i ? "tech-highlight" : ""}`}
                    key={item.name}
                    style={{
                      transform: `translate3d(${i * (exploded ? 28 : 6) - 70}px,${i * 5}px,${i * (exploded ? 28 : 9)}px) rotateX(90deg)`,
                    }}
                  >
                    <Box
                      width={270 - i * 15}
                      depth={Math.max(5, Math.min(60, item.mm * 0.4))}
                      height={210 - i * 13}
                      className={`tech-layer-face tech-layer-${item.material}`}
                    />
                  </button>
                ))}
              {view === "record" &&
                RECORD_SHEETS.map((item, i) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-label={`Open ${item.label}`}
                    aria-pressed={sheet === item.id}
                    data-highlighted={currentTool.produces.includes(item.id)}
                    className="tech-model-sheet"
                    onClick={() => setSheet(item.id)}
                    style={{
                      transform: `translate3d(${(i - 2) * (exploded ? 40 : 18)}px,${(i - 2) * 22}px,${i * (exploded ? 48 : 10)}px) rotateZ(${(i - 2) * 5}deg)`,
                      boxShadow: currentTool.produces.includes(item.id)
                        ? "inset 0 0 0 2px hsl(var(--brand-accent))"
                        : undefined,
                    }}
                  >
                    <div aria-hidden="true">
                      <SampleDocument sheet={item.id} compact />
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className="space-y-3 bg-background p-4">
            {view === "blueprint" && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => (playing ? setPlaying(false) : play())}
                >
                  {playing
                    ? "Pause build"
                    : progress === 100
                      ? "Replay build"
                      : "Build it"}
                </Button>
                <label className="flex min-w-32 flex-1 items-center gap-2 text-xs text-primary">
                  Plan
                  <input
                    aria-label="Blueprint build progress"
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => {
                      setPlaying(false);
                      setProgress(Number(e.target.value));
                    }}
                    className="min-w-0 w-full accent-orange-600"
                  />
                  3D
                </label>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRotation((r) => ({ ...r, z: r.z - 15 }))}
              >
                Rotate left
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRotation((r) => ({ ...r, z: r.z + 15 }))}
              >
                Rotate right
              </Button>
              <Button
                size="sm"
                variant={exploded ? "primary" : "outline"}
                aria-pressed={exploded}
                onClick={() => setExploded(!exploded)}
              >
                Exploded view
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPlaying(false);
                  setProgress(0);
                  setExploded(false);
                  setRotation({ x: 0, z: 0 });
                }}
              >
                Reset view
              </Button>
            </div>
            <SampleLabel />
          </div>
        </Card>
        <Card className="min-w-0 self-start text-foreground" aria-live="polite">
          {view === "blueprint" && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                From drawings to the building
              </p>
              <h3 className="my-3 text-xl font-semibold">
                We read the plans in three dimensions
              </h3>
              <ol className="space-y-4">
                {[
                  "Reading the plan: walls, openings, rooms and dimensions",
                  "Setting levels and the 3.0 m floor-to-floor height",
                  "Raising five floors from the same L-shaped geometry",
                ].map((text, i) => (
                  <li
                    key={text}
                    className={
                      stage === i
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                      {i + 1}
                    </span>
                    {text}
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-muted-foreground">
                Before pricing, our estimators check the elevation, height,
                return and opening against the plan so quantities reflect what
                will be built.
              </p>
              <p className="mt-4 text-xs">
                {progress === 0
                  ? "Finished plan, ready to explore"
                  : `Build sequence ${Math.round(progress)}% · ${Math.min(5, Math.ceil(Math.max(0, ((progress - 42) / 58) * 5)))} of 5 levels`}
              </p>
            </>
          )}
          {view === "wall" && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.entries(WALL_ASSEMBLIES).map(([id, item]) => (
                  <Button
                    key={id}
                    size="sm"
                    variant={assembly === id ? "primary" : "outline"}
                    aria-pressed={assembly === id}
                    onClick={() => {
                      setAssembly(id);
                      setLayer(5);
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
              <WallDetail
                assembly={assembly}
                selected={layer}
                onSelect={setLayer}
              />
              <div className="mt-3 flex flex-wrap gap-1">
                {wall.layers.map((item, i) => (
                  <Button
                    key={item.name}
                    size="sm"
                    variant={layer === i ? "primary" : "outline"}
                    aria-label={`${i + 1}. ${item.name}`}
                    aria-pressed={layer === i}
                    onClick={() => setLayer(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <h3 className="my-3 text-xl font-semibold">
                {layer + 1}. {wall.layers[layer].name} · {wall.layers[layer].mm}{" "}
                mm
              </h3>
              <p className="text-sm">
                <strong>What it does:</strong> {wall.layers[layer].purpose}
              </p>
              <p className="mt-2 text-sm">
                <strong>What we check:</strong> {wall.layers[layer].check}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Typical layers for illustration. Every project follows the
                manufacturer’s system and the drawings.
              </p>
            </>
          )}
          {view === "record" && (
            <>
              <div className="flex flex-wrap gap-2">
                {RECORD_TOOLS.map((item, i) => (
                  <Button
                    key={item.label}
                    size="sm"
                    variant={i === tool ? "primary" : "outline"}
                    aria-pressed={i === tool}
                    onClick={() => {
                      setTool(i);
                      setSheet(item.produces[0]);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{currentTool.role}</h3>
              <p className="my-2 text-xs font-semibold text-primary">
                {currentTool.usage === "every"
                  ? "Used on every project"
                  : "Used when the GC requires it"}
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                {currentTool.description}
              </p>
              <SampleLabel />
              <div className="mt-3 max-h-[430px] overflow-auto">
                <SampleDocument sheet={sheet} compact />
              </div>
            </>
          )}
        </Card>
      </div>
    </ExplorerTabs>
  );
}
