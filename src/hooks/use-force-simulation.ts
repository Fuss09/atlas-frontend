"use client";

import * as React from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
} from "d3-force";
import type { GraphData, GraphEdge, GraphNode } from "@/lib/graph-data";

interface UseForceSimulationOptions {
  width: number;
  height: number;
  /** Called on every simulation tick — the canvas renderer redraws here. */
  onTick: () => void;
}

/**
 * Owns the d3-force simulation lifecycle: creation, force tuning, and
 * teardown on unmount or data change. Kept separate from the canvas
 * renderer so the physics can be reasoned about (and tuned) without
 * touching drawing code, and vice versa.
 *
 * Force tuning targets a calm, readable layout rather than a bouncy
 * one — per the "design must stay sober and fluid" brief: charge is
 * moderate (nodes repel just enough to avoid overlap, not fly apart),
 * link distance scales with edge weight (stronger relations pull
 * tighter), and collision radius scales with connection count (hub
 * nodes get more breathing room).
 */
export function useForceSimulation(
  data: GraphData,
  { width, height, onTick }: UseForceSimulationOptions,
) {
  const simulationRef = React.useRef<Simulation<GraphNode, GraphEdge> | null>(null);
  const onTickRef = React.useRef(onTick);
  onTickRef.current = onTick;

  React.useEffect(() => {
    if (data.nodes.length === 0) return;

    const simulation = forceSimulation<GraphNode>(data.nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphEdge>(data.edges)
          .id((d) => d.id)
          .distance((d) => 90 + (1 - d.weight) * 60)
          .strength((d) => 0.3 + d.confidence * 0.4),
      )
      .force("charge", forceManyBody().strength(-220).distanceMax(400))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<GraphNode>().radius((d) => nodeRadius(d) + 12),
      )
      .alpha(1)
      .alphaDecay(0.02);

    simulation.on("tick", () => onTickRef.current());
    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [data, width, height]);

  const reheat = React.useCallback(() => {
    simulationRef.current?.alphaTarget(0.3).restart();
  }, []);

  const cool = React.useCallback(() => {
    simulationRef.current?.alphaTarget(0);
  }, []);

  return { simulationRef, reheat, cool };
}

/**
 * Node radius by role: center is largest, then scaled gently by
 * connection count so hubs read as more important without dominating
 * the canvas — capped so no node overwhelms its neighbors.
 */
export function nodeRadius(node: GraphNode): number {
  if (node.isCenter) return 22;
  return Math.min(9 + node.connectionCount * 1.5, 18);
}
