/**
 * Atlas — Knowledge Graph types
 * Mirrors backend/app/schemas/graph.py and backend/app/models/graph.py
 */

import type { ISODateString, UUID } from "./api";

export type EntityType =
  | "company"
  | "theme"
  | "event"
  | "technology"
  | "person"
  | "product"
  | "country"
  | "fund";

export type RelationType =
  | "supplies"
  | "uses"
  | "competes_with"
  | "partners_with"
  | "invests_in"
  | "acquired"
  | "member_of_theme"
  | "related_to"
  | "owns"
  | "customer_of"
  | "supplier_of";

export interface RelationResponse {
  id: UUID;
  source_type: EntityType;
  source_id: UUID;
  source_label: string | null;
  target_type: EntityType;
  target_id: UUID;
  target_label: string | null;
  relation_type: RelationType;
  weight: number;
  confidence_score: number;
  relation_source: string;
  is_inferred: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface NeighborResponse {
  entity_type: EntityType;
  entity_id: UUID;
  entity_label: string | null;
  relation_type: RelationType;
  weight: number;
  distance: number;
  /**
   * The parent node and relation edge this neighbor was discovered
   * through during BFS traversal — required to reconstruct a properly
   * connected multi-level graph rather than a flat fan around the
   * center. See backend commit feat(graph): track parent node in BFS.
   */
  via_entity_type: EntityType;
  via_entity_id: UUID;
  via_relation_id: UUID;
}

export interface CompanyGraphResponse {
  company_id: UUID;
  relations_count: number;
  relations: RelationResponse[];
  neighbors: NeighborResponse[];
}

export interface GraphStatsResponse {
  total_relations: number;
  by_type: Record<string, number>;
  by_source: Record<string, number>;
  most_connected_entities: unknown[];
}

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  supplies: "Supplies",
  uses: "Uses",
  competes_with: "Competes With",
  partners_with: "Partners With",
  invests_in: "Invests In",
  acquired: "Acquired",
  member_of_theme: "Member of Theme",
  related_to: "Related To",
  owns: "Owns",
  customer_of: "Customer Of",
  supplier_of: "Supplier Of",
};

/**
 * Semantic grouping for relation types — used to group the Relations
 * tab and graph filters by what the connection *means* to an investor
 * rather than a flat alphabetical list of 11 raw enum values, which
 * reads as a wall of jargon rather than a story.
 */
export type RelationCategory = "market_position" | "business" | "ownership" | "membership";

export const RELATION_CATEGORY_LABELS: Record<RelationCategory, string> = {
  market_position: "Market Position",
  business: "Business Relationships",
  ownership: "Ownership & Investment",
  membership: "Theme Membership",
};

export const RELATION_TYPE_CATEGORY: Record<RelationType, RelationCategory> = {
  competes_with: "market_position",
  supplies: "business",
  supplier_of: "business",
  customer_of: "business",
  uses: "business",
  partners_with: "business",
  invests_in: "ownership",
  owns: "ownership",
  acquired: "ownership",
  member_of_theme: "membership",
  related_to: "market_position",
};

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  company: "Company",
  theme: "Theme",
  event: "Event",
  technology: "Technology",
  person: "Person",
  product: "Product",
  country: "Country",
  fund: "Fund",
};
