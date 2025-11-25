import { motion } from "framer-motion";
import { DiagramConfig } from "@/data/partnership-models";

interface PartnershipDiagramProps {
  config: DiagramConfig;
  className?: string;
  size?: "small" | "large";
}

export const PartnershipDiagram = ({ config, className = "", size = "large" }: PartnershipDiagramProps) => {
  const isSmall = size === "small";
  const width = isSmall ? 300 : 600;
  const height = isSmall ? 200 : 400;
  const nodeRadius = isSmall ? 30 : 40;
  const fontSize = isSmall ? "10px" : "13px";

  const getNodeColor = (type: string, highlighted?: boolean) => {
    if (highlighted) return "hsl(var(--construction-orange))";
    
    switch (type) {
      case "owner": return "hsl(var(--primary))";
      case "consultant": return "hsl(var(--chart-2))";
      case "gc": return "hsl(var(--chart-3))";
      case "ascent": return "hsl(var(--construction-orange))";
      case "subtrade": return "hsl(var(--muted))";
      default: return "hsl(var(--muted))";
    }
  };

  const renderEdges = () => {
    return config.edges.map((edge, i) => {
      const fromNode = config.nodes.find(n => n.id === edge.from);
      const toNode = config.nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return null;

      const x1 = (fromNode.position.x / 100) * width;
      const y1 = (fromNode.position.y / 100) * height;
      const x2 = (toNode.position.x / 100) * width;
      const y2 = (toNode.position.y / 100) * height;

      // Calculate angle for arrow
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowSize = isSmall ? 6 : 8;
      
      return (
        <g key={i}>
          <motion.line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(var(--border))"
            strokeWidth={isSmall ? 1.5 : 2}
            strokeDasharray={isSmall ? "3,3" : "4,4"}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
          {/* Arrow */}
          <motion.polygon
            points={`${x2},${y2} ${x2 - arrowSize * Math.cos(angle - Math.PI / 6)},${y2 - arrowSize * Math.sin(angle - Math.PI / 6)} ${x2 - arrowSize * Math.cos(angle + Math.PI / 6)},${y2 - arrowSize * Math.sin(angle + Math.PI / 6)}`}
            fill="hsl(var(--border))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 + 0.6 }}
          />
          {edge.label && !isSmall && (
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 - 5}
              fill="hsl(var(--muted-foreground))"
              fontSize="11px"
              textAnchor="middle"
              className="font-medium"
            >
              {edge.label}
            </text>
          )}
        </g>
      );
    });
  };

  const renderNodes = () => {
    return config.nodes.map((node, i) => {
      const x = (node.position.x / 100) * width;
      const y = (node.position.y / 100) * height;
      const color = getNodeColor(node.type, node.highlighted);
      const lines = node.label.split('\n');

      return (
        <g key={node.id}>
          <motion.circle
            cx={x}
            cy={y}
            r={nodeRadius}
            fill={node.highlighted ? color : "hsl(var(--card))"}
            stroke={color}
            strokeWidth={node.highlighted ? 3 : 2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: i * 0.15,
              type: "spring",
              stiffness: 200
            }}
            className={node.highlighted ? "drop-shadow-lg" : ""}
          />
          {lines.map((line, lineIndex) => (
            <motion.text
              key={lineIndex}
              x={x}
              y={y + (lines.length === 1 ? 0 : (lineIndex - (lines.length - 1) / 2) * (isSmall ? 12 : 16))}
              fill={node.highlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
              fontSize={fontSize}
              fontWeight={node.highlighted ? "600" : "500"}
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.15 + 0.3 }}
            >
              {line}
            </motion.text>
          ))}
        </g>
      );
    });
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        aria-label="Partnership structure diagram"
        role="img"
      >
        <g>
          {renderEdges()}
          {renderNodes()}
        </g>
      </svg>
    </div>
  );
};
