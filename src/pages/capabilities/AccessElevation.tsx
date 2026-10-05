import { ACCESS_METHODS } from "./access-data";

const COLORS: Record<string, string> = {
  ladder: "#9aa5ae",
  boom: "#e1a730",
  scaffold: "#5b8fd0",
  mast: "#7c6bd6",
  stage: "#F97316",
};

/** The supplied planner is an SVG elevation, using a shared scale for all equipment. */
export function AccessElevation({
  storeys,
  method,
}: {
  storeys: number;
  method: (typeof ACCESS_METHODS)[number];
}) {
  const ground = 400,
    x = 200,
    width = 200;
  const floorHeight = Math.min(11.5, 340 / Math.max(storeys, 12));
  const height = storeys * floorHeight,
    roof = ground - height;
  const reach = Math.min(storeys, method.max / 3) * floorHeight;
  const top = ground - reach,
    color = COLORS[method.id];
  const stage = ground - height * 0.55,
    mastPlatform = ground - reach * 0.6;
  const scaffoldBays = Math.max(1, Math.floor(reach / (floorHeight * 2)));
  const boom = Math.max(top, roof) + 8;
  const ladder = ground - Math.min(storeys, 2) * floorHeight;
  const heightStep = storeys > 15 ? 15 : 6;
  return (
    <svg
      viewBox="0 0 560 420"
      className="w-full"
      role="img"
      aria-label={`Sample ${storeys}-storey building, ${storeys * 3} metres, showing ${method.name}`}
    >
      <rect width="560" height="420" fill="#f6f8fa" />
      {Array.from({ length: 28 }, (_, i) => (
        <line
          key={i}
          x1="0"
          x2="560"
          y1={i * 15}
          y2={i * 15}
          stroke="#e8edf2"
        />
      ))}
      <rect y={ground} width="560" height="20" fill="#d5dbe1" />
      <line
        x1="0"
        x2="560"
        y1={ground}
        y2={ground}
        stroke="#7f8c99"
        strokeWidth="1.5"
      />
      <rect
        x={x}
        y={roof}
        width={width}
        height={height}
        fill="#d8d2c6"
        stroke="#8a826f"
      />
      {Array.from({ length: storeys - 1 }, (_, i) => (
        <line
          key={i}
          x1={x}
          x2={x + width}
          y1={ground - (i + 1) * floorHeight}
          y2={ground - (i + 1) * floorHeight}
          stroke="#a69f92"
          strokeWidth=".6"
        />
      ))}
      {Array.from({ length: storeys }, (_, floor) =>
        Array.from({ length: 6 }, (_, column) => (
          <rect
            key={`${floor}-${column}`}
            x={x + 12 + column * 32}
            y={ground - (floor + 1) * floorHeight + floorHeight * 0.25}
            width="18"
            height={floorHeight * 0.5}
            fill="#3d5a78"
          />
        )),
      )}
      <rect
        x={x - 4}
        y={roof - 6}
        width={width + 8}
        height="6"
        fill="#a69f92"
      />
      {Array.from(
        { length: Math.floor((storeys * 3) / heightStep) + 1 },
        (_, i) => {
          const metres = i * heightStep,
            y = ground - (metres / 3) * floorHeight;
          return (
            <g key={metres}>
              <line
                x1={x + width + 14}
                x2={x + width + 22}
                y1={y}
                y2={y}
                stroke="#5c6670"
              />
              <text x={x + width + 26} y={y + 3} fontSize="10" fill="#5c6670">
                {metres} m
              </text>
            </g>
          );
        },
      )}
      <g data-access-equipment={method.id}>
        {method.id === "stage" && (
          <>
            <line
              x1={x + 60}
              x2={x + 60}
              y1={roof - 6}
              y2={stage}
              stroke={color}
              strokeWidth="1.5"
            />
            <line
              x1={x + 140}
              x2={x + 140}
              y1={roof - 6}
              y2={stage}
              stroke={color}
              strokeWidth="1.5"
            />
            <path
              d={`M${x + 52} ${roof - 6}q8-18 16 0M${x + 132} ${roof - 6}q8-18 16 0`}
              stroke={color}
              fill="none"
              strokeWidth="2"
            />
            <rect x={x + 50} y={stage} width="100" height="10" fill={color} />
            <rect
              x={x + 50}
              y={stage - 14}
              width="100"
              height="14"
              fill="none"
              stroke={color}
            />
            <text
              x={x + 100}
              y={roof - 24}
              textAnchor="middle"
              fontSize="10"
              fill="#36454F"
            >
              Roof anchors
            </text>
          </>
        )}
        {method.id === "scaffold" && (
          <>
            {Array.from(
              { length: Math.ceil(reach / (floorHeight * 2)) },
              (_, i) => (
                <line
                  key={i}
                  x1={x - 26}
                  x2={x}
                  y1={ground - i * floorHeight * 2}
                  y2={ground - i * floorHeight * 2}
                  stroke={color}
                />
              ),
            )}
            <line
              x1={x - 26}
              x2={x - 26}
              y1={ground}
              y2={top}
              stroke={color}
              strokeWidth="2"
            />
            <line
              x1={x - 6}
              x2={x - 6}
              y1={ground}
              y2={top}
              stroke={color}
              strokeWidth="2"
            />
            {Array.from({ length: scaffoldBays }, (_, i) => (
              <line
                key={i}
                x1={x - 26}
                x2={x - 6}
                y1={ground - i * floorHeight * 2}
                y2={Math.max(top, ground - (i + 1) * floorHeight * 2)}
                stroke={color}
                strokeWidth=".8"
              />
            ))}
          </>
        )}
        {method.id === "boom" && (
          <>
            <rect
              x={x - 150}
              y={ground - 16}
              width="60"
              height="16"
              rx="3"
              fill={color}
            />
            <circle cx={x - 140} cy={ground} r="6" fill="#222" />
            <circle cx={x - 100} cy={ground} r="6" fill="#222" />
            <line
              x1={x - 110}
              y1={ground - 16}
              x2={x - 38}
              y2={boom + 10}
              stroke={color}
              strokeWidth="6"
            />
            <rect
              x={x - 44}
              y={boom}
              width="30"
              height="16"
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
          </>
        )}
        {method.id === "mast" && (
          <>
            <rect
              x={x - 40}
              y={top}
              width="10"
              height={reach}
              fill={color}
              opacity=".9"
            />
            <rect
              x={x - 60}
              y={mastPlatform}
              width="56"
              height="10"
              fill={color}
            />
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={i}
                x1={x - 30}
                x2={x}
                y1={ground - (reach * (i + 1)) / 9}
                y2={ground - (reach * (i + 1)) / 9}
                stroke={color}
                strokeWidth=".8"
              />
            ))}
          </>
        )}
        {method.id === "ladder" && (
          <>
            <line
              x1={x - 40}
              x2={x - 6}
              y1={ground}
              y2={ladder}
              stroke={color}
              strokeWidth="2"
            />
            <line
              x1={x - 30}
              x2={x + 4}
              y1={ground}
              y2={ladder}
              stroke={color}
              strokeWidth="2"
            />
          </>
        )}
      </g>
      <rect
        x="12"
        y="12"
        width={method.name.length * 7.5 + 20}
        height="24"
        rx="4"
        fill={color}
      />
      <text x="22" y="28" fontSize="12" fontWeight="700" fill="#003366">
        {method.name}
      </text>
    </svg>
  );
}
