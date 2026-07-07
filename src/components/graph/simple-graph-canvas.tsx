"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RELATION_TYPE_LABELS, type RelationResponse } from "@/types";

interface SimpleGraphCanvasProps {
  centerLabel: string;
  centerId: string;
  relations: RelationResponse[];
  onSelectRelation: (relation: RelationResponse) => void;
}

/**
 * Sprint 1 radial graph renderer — plain SVG, no physics simulation.
 * Places the focal entity at the center and its direct relations in a
 * circle around it, edge opacity mapped to confidence, edge thickness
 * mapped to weight (per validated "graph must be explainable" spec).
 *
 * This is intentionally simple: a full force-directed engine (d3-force
 * or similar) is scoped for Sprint 6. Swapping the renderer later does
 * not change this component's props contract.
 */
export function SimpleGraphCanvas({ centerLabel, centerId, relations, onSelectRelation }: SimpleGraphCanvasProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const width = 800;
  const height = 600;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 100;

  const nodes = relations.map((r, i) => {
    const angle = (i / relations.length) * 2 * Math.PI - Math.PI / 2;
    const isOutgoing = r.source_id === centerId;
    const label = (isOutgoing ? r.target_label : r.source_label) ?? "Unknown";
    return {
      relation: r,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      label,
    };
  });

  return (
    <div className="h-full w-full overflow-auto bg-background">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full min-h-[500px]">
        {/* Edges */}
        {nodes.map(({ relation, x, y }) => (
          <line
            key={relation.id}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="hsl(var(--primary))"
            strokeWidth={Math.max(1, relation.weight * 3)}
            opacity={Math.max(0.15, relation.confidence_score * 0.6)}
            className="transition-opacity"
          />
        ))}

        {/* Center node */}
        <g>
          <circle cx={cx} cy={cy} r={28} className="fill-primary" />
          <text
            x={cx}
            y={cy + 46}
            textAnchor="middle"
            className="fill-foreground text-[13px] font-medium"
          >
            {truncateLabel(centerLabel, 22)}
          </text>
        </g>

        {/* Neighbor nodes */}
        {nodes.map(({ relation, x, y, label }) => {
          const isHovered = hoveredId === relation.id;
          return (
            <g
              key={relation.id}
              onClick={() => onSelectRelation(relation)}
              onMouseEnter={() => setHoveredId(relation.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r={16}
                className={cn("fill-secondary stroke-border transition-all", isHovered && "fill-primary/20 stroke-primary")}
                strokeWidth={1.5}
              />
              <text
                x={x}
                y={y + 32}
                textAnchor="middle"
                className={cn(
                  "text-[11px] transition-colors",
                  isHovered ? "fill-foreground font-medium" : "fill-muted-foreground",
                )}
              >
                {truncateLabel(label, 18)}
              </text>
              <text
                x={x}
                y={y - 24}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] uppercase tracking-wide"
              >
                {RELATION_TYPE_LABELS[relation.relation_type]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function truncateLabel(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
