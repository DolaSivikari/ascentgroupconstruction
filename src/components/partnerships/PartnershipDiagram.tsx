import { motion } from "framer-motion";
import { DiagramConfig } from "@/data/partnership-models";

interface PartnershipDiagramProps {
  config: DiagramConfig;
  className?: string;
  size?: "small" | "large";
}

interface NodeStyle {
  width: number;
  height: number;
  fontSize: string;
  subtitleFontSize: string;
  fill: string;
  stroke: string;
  textColor: string;
  strokeWidth: number;
  rx: number;
}

export const PartnershipDiagram = ({ config, className = "", size = "large" }: PartnershipDiagramProps) => {
  const isSmall = size === "small";
  const width = isSmall ? 400 : 600;
  const height = isSmall ? 280 : 420;

  const getNodeStyle = (type: string, highlighted?: boolean): NodeStyle => {
    const baseSize = isSmall ? 1 : 1.4;
    
    if (highlighted || type === "ascent") {
      return {
        width: 130 * baseSize,
        height: 55 * baseSize,
        fontSize: isSmall ? "11px" : "14px",
        subtitleFontSize: isSmall ? "9px" : "11px",
        fill: "hsl(var(--construction-orange))",
        stroke: "hsl(var(--construction-orange))",
        textColor: "hsl(var(--primary-foreground))",
        strokeWidth: 2,
        rx: isSmall ? 6 : 8,
      };
    }
    
    switch (type) {
      case "owner":
        return {
          width: 100 * baseSize,
          height: 40 * baseSize,
          fontSize: isSmall ? "11px" : "14px",
          subtitleFontSize: isSmall ? "9px" : "11px",
          fill: "hsl(var(--card))",
          stroke: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          strokeWidth: 2,
          rx: isSmall ? 6 : 8,
        };
      case "consultant":
      case "gc":
        return {
          width: 100 * baseSize,
          height: 40 * baseSize,
          fontSize: isSmall ? "11px" : "14px",
          subtitleFontSize: isSmall ? "9px" : "11px",
          fill: "hsl(var(--card))",
          stroke: "hsl(var(--border))",
          textColor: "hsl(var(--foreground))",
          strokeWidth: 2,
          rx: isSmall ? 6 : 8,
        };
      case "subtrade":
        return {
          width: 80 * baseSize,
          height: 35 * baseSize,
          fontSize: isSmall ? "10px" : "12px",
          subtitleFontSize: isSmall ? "8px" : "10px",
          fill: "hsl(var(--muted))",
          stroke: "hsl(var(--border))",
          textColor: "hsl(var(--muted-foreground))",
          strokeWidth: 1.5,
          rx: isSmall ? 6 : 8,
        };
      default:
        return {
          width: 100 * baseSize,
          height: 40 * baseSize,
          fontSize: isSmall ? "11px" : "14px",
          subtitleFontSize: isSmall ? "9px" : "11px",
          fill: "hsl(var(--card))",
          stroke: "hsl(var(--border))",
          textColor: "hsl(var(--foreground))",
          strokeWidth: 2,
          rx: isSmall ? 6 : 8,
        };
    }
  };

  const renderEdges = () => {
    return config.edges.map((edge, i) => {
      const fromNode = config.nodes.find(n => n.id === edge.from);
      const toNode = config.nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return null;

      const fromStyle = getNodeStyle(fromNode.type, fromNode.highlighted);
      const toStyle = getNodeStyle(toNode.type, toNode.highlighted);

      const x1 = (fromNode.position.x / 100) * width;
      const y1 = (fromNode.position.y / 100) * height;
      const x2 = (toNode.position.x / 100) * width;
      const y2 = (toNode.position.y / 100) * height;

      // Calculate connection points at node edges
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const startX = x1;
      const startY = y1 + fromStyle.height / 2;
      const endX = x2;
      const endY = y2 - toStyle.height / 2;

      const arrowSize = isSmall ? 6 : 8;
      
      return (
        <g key={i}>
          <motion.line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="hsl(var(--border))"
            strokeWidth={isSmall ? 1.5 : 2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
          {/* Arrow */}
          <motion.polygon
            points={`${endX},${endY} ${endX - arrowSize * Math.cos(Math.PI / 2 - Math.PI / 6)},${endY - arrowSize * Math.sin(Math.PI / 2 - Math.PI / 6)} ${endX + arrowSize * Math.cos(Math.PI / 2 - Math.PI / 6)},${endY - arrowSize * Math.sin(Math.PI / 2 - Math.PI / 6)}`}
            fill="hsl(var(--border))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.3, delay: i * 0.1 + 0.6 }}
          />
          {edge.label && !isSmall && (
            <g>
              <rect
                x={(x1 + x2) / 2 - 25}
                y={(startY + endY) / 2 - 10}
                width="50"
                height="20"
                fill="hsl(var(--background))"
                rx="4"
                opacity="0.9"
              />
              <text
                x={(x1 + x2) / 2}
                y={(startY + endY) / 2 + 4}
                fill="hsl(var(--muted-foreground))"
                fontSize="10px"
                textAnchor="middle"
                className="font-medium"
              >
                {edge.label}
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  const renderNodes = () => {
    return config.nodes.map((node, i) => {
      const x = (node.position.x / 100) * width;
      const y = (node.position.y / 100) * height;
      const style = getNodeStyle(node.type, node.highlighted);

      return (
        <g key={node.id}>
          <motion.rect
            x={x - style.width / 2}
            y={y - style.height / 2}
            width={style.width}
            height={style.height}
            rx={style.rx}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={style.strokeWidth}
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
          <motion.text
            x={x}
            y={node.subtitle ? y - 5 : y}
            fill={style.textColor}
            fontSize={style.fontSize}
            fontWeight={node.highlighted ? "700" : "600"}
            textAnchor="middle"
            dominantBaseline="middle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.15 + 0.3 }}
          >
            {node.label}
          </motion.text>
          {node.subtitle && (
            <motion.text
              x={x}
              y={y + 10}
              fill={style.textColor}
              fontSize={style.subtitleFontSize}
              fontWeight="500"
              textAnchor="middle"
              dominantBaseline="middle"
              opacity="0.8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.3, delay: i * 0.15 + 0.4 }}
            >
              {node.subtitle}
            </motion.text>
          )}
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
