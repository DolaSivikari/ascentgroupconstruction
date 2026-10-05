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
import {
  BLUEPRINT_OUTLINE,
  BLUEPRINT_SLABS,
  wallLayout,
} from "../model-geometry";
import { SampleDocument, SampleLabel } from "./SampleDocuments";

function WindowFace({ width, height }: { width: number; height: number }) {
  // Repeat the supplied façade tiles without stretching a floor as the building rises.
  const rows = Math.ceil(height / 30);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <rect width={width} height={height} fill="#d8d2c6" />
      {Array.from({ length: rows }, (_, floor) => {
        const y = height - (floor + 1) * 30;
        const storefront = floor === 0;
        const spacing = storefront ? 60 : 40;
        return (
          <g key={floor} transform={`translate(0 ${y})`}>
            <rect
              width={width}
              height="30"
              fill={storefront ? "#7f8a94" : "#d8d2c6"}
            />
            <rect y="27" width={width} height="3" fill="#a69f92" />
            {Array.from({ length: Math.ceil(width / spacing) }, (_, i) => {
              const x = i * spacing + (storefront ? 3 : 11),
                w = storefront ? 54 : 18;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={storefront ? 6 : 7}
                    width={w}
                    height={storefront ? 24 : 15}
                    fill="#3d5a78"
                    stroke="#f4f1ea"
                    strokeWidth="1.6"
                  />
                  <path
                    d={`M${x + w / 2} ${storefront ? 6 : 7}V${storefront ? 30 : 22}`}
                    stroke="#f4f1ea"
                    strokeWidth="1.2"
                  />
                  <rect
                    x={x + 1}
                    y="8"
                    width="7"
                    height="5"
                    fill="#7d9bb8"
                    opacity=".6"
                  />
                  {storefront ? (
                    <path d={`M${x} 13h${w}`} stroke="#cfd6dd" />
                  ) : (
                    <rect
                      x={x - 1.5}
                      y="22"
                      width="21"
                      height="2"
                      fill="#bfb7a8"
                    />
                  )}
                </g>
              );
            })}
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
  faceClasses,
  style,
}: {
  width: number;
  depth: number;
  height: number;
  className?: string;
  top?: ReactNode;
  faceClasses?: { top?: string; side?: string; edge?: string };
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
          className={`tech-face ${i === 0 ? (faceClasses?.top ?? "") : i > 3 ? (faceClasses?.edge ?? faceClasses?.side ?? "") : (faceClasses?.side ?? "")}`}
          style={{
            width: face.width,
            height: face.height,
            transform: face.transform,
          }}
        >
          {face.content}
          {(i === 2 || i === 3) && className.includes("building") && (
            <WindowFace width={face.width} height={face.height} />
          )}
        </div>
      ))}
    </div>
  );
}

function BlueprintModel({ progress }: { progress: number }) {
  const floors = Math.max(0, ((progress - 42) / 58) * 5);
  const height = floors * 30;
  return (
    <>
      <Box
        width={640}
        depth={440}
        height={2}
        style={{ transform: "translateZ(-2px)" }}
        faceClasses={{
          top: "tech-blueprint-paper",
          side: "tech-blueprint-edge",
        }}
        top={<FloorPlan />}
      />
      {height > 0.5 &&
        BLUEPRINT_OUTLINE.map(([x, y], i) => {
          const [endX, endY] =
            BLUEPRINT_OUTLINE[(i + 1) % BLUEPRINT_OUTLINE.length];
          const angle = (Math.atan2(endY - y, endX - x) * 180) / Math.PI;
          return (
            <Box
              key={i}
              width={Math.hypot(endX - x, endY - y) + 3}
              depth={3}
              height={height + (floors >= 5 ? 5 : 0)}
              className="tech-building"
              faceClasses={{ top: "tech-parapet", edge: "tech-facade-edge" }}
              style={{
                transform: `translate3d(${(x + endX) / 2}px,${(y + endY) / 2}px,0) rotateZ(${angle}deg)`,
              }}
            />
          );
        })}
      {Array.from({ length: 5 }, (_, i) => i + 1).map(
        (floor) =>
          floors >= floor - 0.02 &&
          BLUEPRINT_SLABS.map(([x, y, w, d], part) => (
            <Box
              key={`${floor}-${part}`}
              width={w - 6}
              depth={d - 6}
              height={2}
              faceClasses={{ top: "tech-slab", side: "tech-slab-edge" }}
              style={{
                transform: `translate3d(${x + w / 2}px,${y + d / 2}px,${floor * 30 - 2}px)`,
              }}
            />
          )),
      )}
      {floors >= 5 && (
        <>
          <Box
            width={40}
            depth={26}
            height={14}
            faceClasses={{ top: "tech-rtu-top", side: "tech-rtu" }}
            style={{
              transform: `translate3d(-120px,-60px,${150}px)`,
            }}
          />
          <Box
            width={46}
            depth={36}
            height={22}
            faceClasses={{ top: "tech-slab", side: "tech-facade-edge" }}
            style={{
              transform: `translate3d(65px,-10px,${150}px)`,
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
  const [spinning, setSpinning] = useState(false);
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
  const dragged = useRef(false);
  const animationStart = useRef(0);
  const animationProgress = useRef(0);

  useEffect(() => {
    const viewer = ref.current;
    if (!viewer) return;
    const resize = new ResizeObserver(([entry]) =>
      setScale(
        Math.min(
          1,
          entry.contentRect.width / 850,
          entry.contentRect.height / 650,
        ),
      ),
    );
    resize.observe(viewer);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setPlaying(false);
        setSpinning(false);
      }
    });
    observer.observe(viewer);
    const stop = () => {
      if (document.hidden) {
        setPlaying(false);
        setSpinning(false);
      }
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

  useEffect(() => {
    if (!spinning || rm) return;
    let frame: number,
      previous = performance.now();
    const tick = (now: number) => {
      const change = (now - previous) * 0.01;
      previous = now;
      setRotation((r) => ({ ...r, z: r.z + change }));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spinning, rm]);

  const selectView = (next: string) => {
    setPlaying(false);
    setSpinning(false);
    setView(next);
    setRotation({ x: 0, z: 0 });
    setExploded(next === "record");
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
  const camera = Math.max(0, Math.min(1, (progress - 24) / 18));
  const ease = camera < 0.5 ? 4 * camera ** 3 : 1 - (-2 * camera + 2) ** 3 / 2;
  const tilt = view === "blueprint" ? ease * 56 : view === "wall" ? 66 : 58;
  const spin = view === "blueprint" ? -ease * 32 : view === "wall" ? 128 : -30;
  const wall = WALL_ASSEMBLIES[assembly];
  const layers = wallLayout(wall.layers, exploded);
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
              setSpinning(false);
              dragged.current = false;
              drag.current = { x: e.clientX, y: e.clientY, rotation };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              const dx = e.clientX - drag.current.x,
                dy = e.clientY - drag.current.y;
              if (!dragged.current && Math.max(Math.abs(dx), Math.abs(dy)) < 5)
                return;
              dragged.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
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
            onClickCapture={(e) => {
              if (dragged.current) {
                e.preventDefault();
                e.stopPropagation();
                dragged.current = false;
              }
            }}
            onPointerCancel={(e) => {
              dragged.current = false;
              drag.current = undefined;
              e.currentTarget.style.touchAction = "pan-y";
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
            <div className="tech-scene">
              <div
                className="tech-world"
                style={{
                  transform: `scale(${scale}) rotateX(${Math.max(0, Math.min(85, tilt + rotation.x))}deg) rotateZ(${spin + rotation.z}deg)`,
                }}
              >
                {view === "blueprint" && <BlueprintModel progress={progress} />}
                {view === "wall" &&
                  wall.layers.map((item, i) => (
                    <button
                      type="button"
                      aria-label={`Select 3D layer: ${item.name}`}
                      aria-pressed={layer === i}
                      onClick={() => setLayer(i)}
                      className={`tech-model-part ${layer === i ? "tech-highlight" : exploded ? "tech-layer-dim" : ""}`}
                      key={item.name}
                      style={{
                        transform: `translate3d(${layers[i].x}px,${layers[i].y}px,-140px)`,
                      }}
                    >
                      <Box
                        width={layers[i].thickness}
                        depth={layers[i].width}
                        height={layers[i].height}
                        className={`tech-layer-material tech-material-${assembly}-${i}`}
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
                      className="tech-model-part tech-record-sheet"
                      onClick={() => setSheet(item.id)}
                      style={{
                        transform: `translate3d(${(i - 2) * (exploded ? 14 : 0)}px,${(i - 2) * (exploded ? -10 : 0)}px,${(i - 2) * (exploded ? 64 : 8) + (sheet === item.id ? (exploded ? 30 : 18) : 0)}px)`,
                      }}
                    >
                      <Box
                        width={280}
                        depth={190}
                        height={5}
                        faceClasses={{
                          top: "tech-model-sheet",
                          side: "tech-sheet-edge",
                        }}
                        top={
                          <div
                            className="tech-sheet-content"
                            aria-hidden="true"
                          >
                            <SampleDocument sheet={item.id} compact />
                          </div>
                        }
                      />
                    </button>
                  ))}
              </div>
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
              {view !== "blueprint" && (
                <>
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
                    disabled={rm}
                    aria-pressed={spinning}
                    onClick={() => setSpinning(!spinning)}
                  >
                    Auto-turn
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPlaying(false);
                  setSpinning(false);
                  setProgress(0);
                  setExploded(view === "record");
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
                      setSpinning(false);
                      setRotation({ x: 0, z: 0 });
                      setAssembly(id);
                      setLayer(id === "stucco" ? 4 : 5);
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
