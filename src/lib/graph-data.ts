import type { EntityType, NeighborResponse, RelationResponse } from "@/types";

/**
 * A node in the rendered graph. Extends d3-force's SimulationNodeDatum
 * shape (x/y/vx/vy get written by the simulation) without importing the
 * type directly here, to keep this module free of d3 imports — only
 * the canvas renderer needs to know about d3-force specifically.
 */
export interface GraphNode {
  id: string; // `${entity_type}:${entity_id}` — unique across entity types
  entityType: EntityType;
  entityId: string;
  label: string;
  distance: number; // 0 = center, 1/2/3 = BFS depth
  isCenter: boolean;
  connectionCount: number;
  // d3-force writes these in place during simulation
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null; // pinned position (drag)
  fy?: number | null;
}

export interface GraphEdge {
  id: string; // relation UUID
  source: string; // GraphNode.id
  target: string; // GraphNode.id
  relation: RelationResponse | null; // full relation detail, null for a BFS-only edge (rare)
  weight: number;
  confidence: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

function nodeId(entityType: EntityType, entityId: string): string {
  return `${entityType}:${entityId}`;
}

/**
 * Builds a connected multi-level graph from the API response.
 *
 * Depth-1 edges come from `relations` (full RelationResponse, including
 * confidence/weight/source for the detail panel). Depth-2/3 edges come
 * from `neighbors`, using each neighbor's via_entity_type/via_entity_id
 * to attach it to its actual parent node — not the center — so the
 * rendered graph reflects the real traversal structure instead of a
 * flat fan. Relation-level detail (confidence, source, is_inferred)
 * isn't available for these edges since /graph doesn't return the full
 * RelationResponse for them — the detail panel falls back to what
 * NeighborResponse does carry (relation_type, weight).
 */
export function buildGraphData(
  centerType: EntityType,
  centerId: string,
  centerLabel: string,
  relations: RelationResponse[],
  neighbors: NeighborResponse[],
): GraphData {
  const nodesById = new Map<string, GraphNode>();
  const edgesById = new Map<string, GraphEdge>();
  const centerNodeId = nodeId(centerType, centerId);

  nodesById.set(centerNodeId, {
    id: centerNodeId,
    entityType: centerType,
    entityId: centerId,
    label: centerLabel,
    distance: 0,
    isCenter: true,
    connectionCount: 0,
  });

  // Depth-1: full relation detail available, direction relative to center.
  for (const r of relations) {
    const isOutgoing = r.source_type === centerType && r.source_id === centerId;
    const otherType = isOutgoing ? r.target_type : r.source_type;
    const otherId = isOutgoing ? r.target_id : r.source_id;
    const otherLabel = (isOutgoing ? r.target_label : r.source_label) ?? "Unknown";
    const otherNodeId = nodeId(otherType, otherId);

    if (!nodesById.has(otherNodeId)) {
      nodesById.set(otherNodeId, {
        id: otherNodeId,
        entityType: otherType,
        entityId: otherId,
        label: otherLabel,
        distance: 1,
        isCenter: false,
        connectionCount: 0,
      });
    }

    edgesById.set(r.id, {
      id: r.id,
      source: centerNodeId,
      target: otherNodeId,
      relation: r,
      weight: r.weight,
      confidence: r.confidence_score,
    });
  }

  // Depth-2/3: attach via the real parent (via_entity_*), not the center.
  // Sort by distance first so a node's parent always exists by the time
  // we process it, regardless of the array order the API returned.
  const sortedNeighbors = [...neighbors].sort((a, b) => a.distance - b.distance);
  for (const n of sortedNeighbors) {
    const thisNodeId = nodeId(n.entity_type, n.entity_id);
    const parentNodeId = nodeId(n.via_entity_type, n.via_entity_id);

    if (!nodesById.has(thisNodeId)) {
      nodesById.set(thisNodeId, {
        id: thisNodeId,
        entityType: n.entity_type,
        entityId: n.entity_id,
        label: n.entity_label ?? "Unknown",
        distance: n.distance,
        isCenter: false,
        connectionCount: 0,
      });
    }

    // Parent should already exist (sorted by distance) — skip defensively
    // if the backend ever returns an orphaned neighbor rather than crash.
    if (!nodesById.has(parentNodeId)) continue;

    const edgeId = n.via_relation_id;
    if (!edgesById.has(edgeId)) {
      edgesById.set(edgeId, {
        id: edgeId,
        source: parentNodeId,
        target: thisNodeId,
        relation: null,
        weight: n.weight,
        confidence: 1, // not carried by NeighborResponse; treat as nominal
      });
    }
  }

  const edges = Array.from(edgesById.values());
  for (const edge of edges) {
    const source = nodesById.get(edge.source);
    const target = nodesById.get(edge.target);
    if (source) source.connectionCount += 1;
    if (target) target.connectionCount += 1;
  }

  return { nodes: Array.from(nodesById.values()), edges };
}
