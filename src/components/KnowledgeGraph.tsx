import { useRef, useState, useEffect, useCallback } from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface KnowledgeGraphProps {
  centerId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeClick?: (id: string) => void;
}

const NODE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  expedition: { fill: '#1a3a6b', stroke: '#4488ff', text: '#93c5fd' },
  dataset: { fill: '#1a3d2a', stroke: '#22c55e', text: '#86efac' },
  publication: { fill: '#3d2a10', stroke: '#f97316', text: '#fdba74' },
  media: { fill: '#2d1a3d', stroke: '#a855f7', text: '#d8b4fe' },
  station: { fill: '#1a3a3d', stroke: '#06b6d4', text: '#67e8f9' },
  article: { fill: '#1a3d3a', stroke: '#14b8a6', text: '#5eead4' },
  center: { fill: '#003344', stroke: '#00d1ff', text: '#e0f7ff' },
};

function getColor(type: string) {
  return NODE_COLORS[type.toLowerCase()] ?? { fill: '#1a2040', stroke: '#4a6080', text: '#9ab0c0' };
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  isCenter: boolean;
}

function layoutNodes(
  centerId: string,
  nodes: GraphNode[],
  cx: number,
  cy: number,
  radius: number
): PositionedNode[] {
  const peripheral = nodes.filter((n) => n.id !== centerId);
  const center = nodes.find((n) => n.id === centerId);

  const positioned: PositionedNode[] = [];

  if (center) {
    positioned.push({ ...center, x: cx, y: cy, isCenter: true });
  }

  peripheral.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / peripheral.length - Math.PI / 2;
    positioned.push({
      ...node,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      isCenter: false,
    });
  });

  return positioned;
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

export default function KnowledgeGraph({
  centerId,
  nodes,
  edges,
  onNodeClick,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ w: 600, h: 400 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateDims = useCallback(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDims({ w: rect.width || 600, h: rect.height || 400 });
    }
  }, []);

  useEffect(() => {
    updateDims();
    const ro = new ResizeObserver(updateDims);
    if (svgRef.current) ro.observe(svgRef.current);
    return () => ro.disconnect();
  }, [updateDims]);

  const cx = dims.w / 2;
  const cy = dims.h / 2;
  const radius = Math.min(dims.w, dims.h) * 0.36;

  const positioned = layoutNodes(centerId, nodes, cx, cy, radius);
  const nodeMap = new Map(positioned.map((n) => [n.id, n]));

  // Filter edges to only include known nodes
  const validEdges = edges.filter((e) => nodeMap.has(e.from) && nodeMap.has(e.to));

  return (
    <div className="relative w-full h-full min-h-[360px] bg-[#060914] rounded-2xl overflow-hidden border border-white/10">
      {/* Legend */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
        {Object.entries(NODE_COLORS)
          .filter(([k]) => k !== 'center')
          .map(([type, col]) => (
            <span
              key={type}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full capitalize"
              style={{ background: col.fill, color: col.text, border: `1px solid ${col.stroke}40` }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: col.stroke }}
              />
              {type}
            </span>
          ))}
      </div>

      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Cyan glow */}
          <filter id="cyanGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {validEdges.map((edge, i) => {
          const from = nodeMap.get(edge.from)!;
          const to = nodeMap.get(edge.to)!;
          const isHighlighted = hoveredId === edge.from || hoveredId === edge.to;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? '#00d1ff' : '#2a4060'}
              strokeWidth={isHighlighted ? 1.5 : 1}
              strokeOpacity={isHighlighted ? 0.7 : 0.4}
              strokeDasharray={isHighlighted ? undefined : '4 4'}
            />
          );
        })}

        {/* Nodes */}
        {positioned.map((node) => {
          const col = node.isCenter ? NODE_COLORS.center : getColor(node.type);
          const r = node.isCenter ? 34 : 22;
          const isHovered = hoveredId === node.id;
          const displayLabel = truncate(node.label, node.isCenter ? 14 : 11);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onNodeClick?.(node.id)}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Glow ring on hover */}
              {isHovered && (
                <circle
                  r={r + 8}
                  fill="none"
                  stroke={col.stroke}
                  strokeWidth={1}
                  strokeOpacity={0.4}
                  filter="url(#glow)"
                />
              )}
              {/* Node circle */}
              <circle
                r={r}
                fill={col.fill}
                stroke={col.stroke}
                strokeWidth={node.isCenter ? 2.5 : 1.5}
                filter={node.isCenter ? 'url(#cyanGlow)' : isHovered ? 'url(#glow)' : undefined}
              />
              {/* Label */}
              <text
                textAnchor="middle"
                dy="0.3em"
                fontSize={node.isCenter ? 11 : 9}
                fontWeight={node.isCenter ? 700 : 500}
                fill={col.text}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {displayLabel}
              </text>
              {/* Type label for peripheral nodes */}
              {!node.isCenter && (
                <text
                  textAnchor="middle"
                  dy={r + 14}
                  fontSize={8}
                  fill={col.stroke}
                  opacity={0.8}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {node.type}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
