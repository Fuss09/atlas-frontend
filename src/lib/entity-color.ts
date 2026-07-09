import type { EntityType } from "@/types";

/**
 * Desaturated per-entity-type accent colors for the graph canvas.
 * Deliberately muted to match the "sober and fluid" design brief —
 * color distinguishes entity types without turning the graph into a
 * rainbow.
 */
export const ENTITY_COLORS: Record<EntityType, string> = {
  company: "hsl(239, 84%, 67%)", // primary
  theme: "hsl(280, 60%, 65%)",
  event: "hsl(38, 92%, 60%)",
  technology: "hsl(200, 80%, 60%)",
  person: "hsl(160, 55%, 55%)",
  product: "hsl(340, 65%, 65%)",
  country: "hsl(25, 70%, 60%)",
  fund: "hsl(190, 60%, 55%)",
};

export function entityColor(type: EntityType): string {
  return ENTITY_COLORS[type] ?? ENTITY_COLORS.company;
}
