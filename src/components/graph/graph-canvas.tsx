"use client";

import * as React from "react";
import { select, type Selection } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomTransform } from "d3-zoom";
import { drag, type D3DragEvent } from "d3-drag";
import { useForceSimulation, nodeRadius } from "@/hooks/use-force-simulation";
import { entityColor } from "@/lib/entity-color";
import type { GraphData, GraphEdge, GraphNode } from "@/lib/graph-data";

interface GraphCanvasProps {
  data: GraphData;
  selectedEdgeId: string | null;
  hoveredNodeId: string | null;
  onSelectEdge: (edge: GraphEdge | null) => void;
  onHoverNode: (nodeId: string | null) => void;
  onRecenter: (node: GraphNode) => void;
  className?: string;
}

export interface GraphCanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

/**
 * The real interactive Knowledge Graph renderer. Canvas (not SVG) for
 * performance headroom as the graph grows, driven by d3-force for
 * layout and d3-zoom/d3-drag for interaction — deliberately not a full
 * graph-visualization library, to keep the client bundle minimal and
 * every visual detail aligned with the design system.
 *
 * Interactions:
 *   - Wheel / pinch: zoom (clamped 0.25x-3x)
 *   - Drag on background: pan
 *   - Drag on a node: reposition it (pins it; simulation keeps running)
 *   - Click a node: recenter the graph on it (onRecenter)
 *   - Click an edge: select it for the detail panel (onSelectEdge)
 *   - Hover a node: highlights its direct edges and dims the rest
 *
 * Exposes zoomIn/zoomOut/resetView via ref for the external toolbar
 * (GraphControls) — d3-zoom owns the transform, so external buttons
 * drive it through the same zoom behavior rather than reimplementing
 * transform math.
 */
export const GraphCanvas = React.forwardRef<GraphCanvasHandle, GraphCanvasProps>(function GraphCanvas({
  data,
  selectedEdgeId,
  hoveredNodeId,
  onSelectEdge,
  onHoverNode,
  onRecenter,
  className,
}, ref) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const transformRef = React.useRef<ZoomTransform>(zoomIdentity);
  const zoomBehaviorRef = React.useRef<ReturnType<typeof zoom<HTMLCanvasElement, unknown>> | null>(null);
  const [size, setSize] = React.useState({ width: 800, height: 600 });
  const dprRef = React.useRef(1);

  const dataRef = React.useRef(data);
  dataRef.current = data;
  const selectedEdgeIdRef = React.useRef(selectedEdgeId);
  selectedEdgeIdRef.current = selectedEdgeId;
  const hoveredNodeIdRef = React.useRef(hoveredNodeId);
  hoveredNodeIdRef.current = hoveredNodeId;
  const onSelectEdgeRef = React.useRef(onSelectEdge);
  onSelectEdgeRef.current = onSelectEdge;
  const onHoverNodeRef = React.useRef(onHoverNode);
  onHoverNodeRef.current = onHoverNode;
  const onRecenterRef = React.useRef(onRecenter);
  onRecenterRef.current = onRecenter;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = size;
    const dpr = dprRef.current;
    ctx.save();
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.scale(dpr, dpr);

    const t = transformRef.current;
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const { nodes, edges } = dataRef.current;
    const hoveredId = hoveredNodeIdRef.current;
    const selectedId = selectedEdgeIdRef.current;

    const highlightedNodeIds = new Set<string>();
    if (hoveredId) {
      highlightedNodeIds.add(hoveredId);
      for (const e of edges) {
        const sourceId = edgeEndId(e.source);
        const targetId = edgeEndId(e.target);
        if (sourceId === hoveredId) highlightedNodeIds.add(targetId);
        if (targetId === hoveredId) highlightedNodeIds.add(sourceId);
      }
    }
    const isDimmed = (id: string) => hoveredId !== null && !highlightedNodeIds.has(id);

    for (const edge of edges) {
      const source = resolveEnd(edge.source, nodes);
      const target = resolveEnd(edge.target, nodes);
      if (!source || source.x === undefined || source.y === undefined) continue;
      if (!target || target.x === undefined || target.y === undefined) continue;

      const isSelected = edge.id === selectedId;
      const dimmed = isDimmed(source.id) && isDimmed(target.id);

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.lineWidth = Math.max(1, edge.weight * 3) / t.k;
      ctx.strokeStyle = isSelected
        ? "hsl(239, 84%, 67%)"
        : `hsla(240, 5%, 65%, ${dimmed ? 0.08 : Math.max(0.15, edge.confidence * 0.5)})`;
      ctx.stroke();
    }

    for (const node of nodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const r = nodeRadius(node);
      const dimmed = isDimmed(node.id);
      const isHovered = node.id === hoveredId;
      const color = entityColor(node.entityType);

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.isCenter ? color : dimmed ? "hsla(240, 5%, 40%, 0.25)" : color;
      ctx.globalAlpha = node.isCenter || dimmed || isHovered ? 1 : 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (node.isCenter || isHovered) {
        ctx.lineWidth = 2 / t.k;
        ctx.strokeStyle = "hsl(0, 0%, 100%)";
        ctx.globalAlpha = 0.9;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const showLabel = node.isCenter || isHovered || t.k > 1.1;
      if (showLabel && !dimmed) {
        ctx.font = `${node.isCenter ? 600 : 500} ${12 / t.k}px sans-serif`;
        ctx.fillStyle = "hsl(240, 5%, 93%)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(truncateLabel(node.label, 20), node.x, node.y + r + 6 / t.k);
      }
    }

    ctx.restore();
  }, [size]);

  const { reheat, cool } = useForceSimulation(data, {
    width: size.width,
    height: size.height,
    onTick: draw,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const canvasSelection = select(canvas) as Selection<HTMLCanvasElement, unknown, null, undefined>;

    function nodeAt(px: number, py: number): GraphNode | null {
      const t = transformRef.current;
      const x = (px - t.x) / t.k;
      const y = (py - t.y) / t.k;
      const nodes = dataRef.current.nodes;
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (node.x === undefined || node.y === undefined) continue;
        const r = nodeRadius(node) + 4;
        const dx = x - node.x;
        const dy = y - node.y;
        if (dx * dx + dy * dy <= r * r) return node;
      }
      return null;
    }

    function edgeAt(px: number, py: number): GraphEdge | null {
      const t = transformRef.current;
      const x = (px - t.x) / t.k;
      const y = (py - t.y) / t.k;
      const { nodes, edges } = dataRef.current;
      const threshold = 6 / t.k;
      for (const edge of edges) {
        const source = resolveEnd(edge.source, nodes);
        const target = resolveEnd(edge.target, nodes);
        if (!source?.x || !source?.y || !target?.x || !target?.y) continue;
        const dist = pointToSegmentDistance(x, y, source.x, source.y, target.x, target.y);
        if (dist <= threshold) return edge;
      }
      return null;
    }

    const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .filter((event) => {
        if (event.type === "mousedown") {
          const [px, py] = pointFromEvent(event, canvas);
          return nodeAt(px, py) === null;
        }
        return true;
      })
      .on("zoom", (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        transformRef.current = event.transform;
        draw();
      });

    canvasSelection.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;

    let dragged = false;
    const dragBehavior = drag<HTMLCanvasElement, unknown>()
      .subject((event) => {
        const [px, py] = pointFromEvent(event, canvas);
        return nodeAt(px, py) ?? {};
      })
      .on("start", (event: D3DragEvent<HTMLCanvasElement, unknown, GraphNode>) => {
        dragged = false;
        if (!event.subject || !("id" in event.subject)) return;
        const node = event.subject as GraphNode;
        node.fx = node.x;
        node.fy = node.y;
        reheat();
      })
      .on("drag", (event: D3DragEvent<HTMLCanvasElement, unknown, GraphNode>) => {
        if (!event.subject || !("id" in event.subject)) return;
        dragged = true;
        const node = event.subject as GraphNode;
        const t = transformRef.current;
        node.fx = (event.x - t.x) / t.k;
        node.fy = (event.y - t.y) / t.k;
      })
      .on("end", (event: D3DragEvent<HTMLCanvasElement, unknown, GraphNode>) => {
        cool();
        if (!event.subject || !("id" in event.subject)) return;
        const node = event.subject as GraphNode;
        if (!dragged) {
          node.fx = null;
          node.fy = null;
          onRecenterRef.current(node);
        }
      });

    canvasSelection.call(dragBehavior);

    canvasSelection.on("click", (event: MouseEvent) => {
      const [px, py] = pointFromEvent(event, canvas);
      if (nodeAt(px, py)) return;
      const edge = edgeAt(px, py);
      onSelectEdgeRef.current(edge);
    });

    canvasSelection.on("mousemove", (event: MouseEvent) => {
      const [px, py] = pointFromEvent(event, canvas);
      const node = nodeAt(px, py);
      const newHoverId = node?.id ?? null;
      if (newHoverId !== hoveredNodeIdRef.current) {
        onHoverNodeRef.current(newHoverId);
      }
      canvas.style.cursor = node || edgeAt(px, py) ? "pointer" : "grab";
    });
    canvasSelection.on("mouseleave", () => onHoverNodeRef.current(null));

    draw();

    return () => {
      canvasSelection
        .on(".zoom", null)
        .on(".drag", null)
        .on("click", null)
        .on("mousemove", null)
        .on("mouseleave", null);
    };
  }, [size, data, draw, reheat, cool]);

  React.useEffect(() => {
    draw();
  }, [hoveredNodeId, selectedEdgeId, draw]);

  React.useImperativeHandle(ref, () => ({
    zoomIn: () => {
      const canvas = canvasRef.current;
      const zoomBehavior = zoomBehaviorRef.current;
      if (!canvas || !zoomBehavior) return;
      zoomBehavior.scaleBy(select(canvas), 1.4);
    },
    zoomOut: () => {
      const canvas = canvasRef.current;
      const zoomBehavior = zoomBehaviorRef.current;
      if (!canvas || !zoomBehavior) return;
      zoomBehavior.scaleBy(select(canvas), 1 / 1.4);
    },
    resetView: () => {
      const canvas = canvasRef.current;
      const zoomBehavior = zoomBehaviorRef.current;
      if (!canvas || !zoomBehavior) return;
      zoomBehavior.transform(select(canvas), zoomIdentity);
    },
  }));

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
});

function edgeEndId(end: string | GraphNode): string {
  return typeof end === "string" ? end : end.id;
}

function resolveEnd(end: string | GraphNode, nodes: GraphNode[]): GraphNode | undefined {
  if (typeof end !== "string") return end;
  return nodes.find((n) => n.id === end);
}

function pointFromEvent(
  event: MouseEvent | D3DragEvent<HTMLCanvasElement, unknown, unknown>,
  canvas: HTMLCanvasElement,
): [number, number] {
  const rect = canvas.getBoundingClientRect();
  const sourceEvent = "sourceEvent" in event ? (event.sourceEvent as MouseEvent) : event;
  return [sourceEvent.clientX - rect.left, sourceEvent.clientY - rect.top];
}

function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

function truncateLabel(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
