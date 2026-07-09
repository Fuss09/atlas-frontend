"use client";

import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { RELATION_TYPE_LABELS, type RelationType } from "@/types";
import { Filter } from "lucide-react";

interface GraphControlsProps {
  depth: 1 | 2 | 3;
  onDepthChange: (depth: 1 | 2 | 3) => void;
  activeTypes: Set<RelationType>;
  onToggleType: (type: RelationType) => void;
  onResetTypes: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  availableTypes: RelationType[];
}

/**
 * Depth selector, relation-type filter, and zoom controls — kept as a
 * thin overlay row rather than a full sidebar, so the graph canvas
 * stays the visual focus (per "design must stay sober and fluid").
 */
export function GraphControls({
  depth,
  onDepthChange,
  activeTypes,
  onToggleType,
  onResetTypes,
  onZoomIn,
  onZoomOut,
  onResetView,
  availableTypes,
}: GraphControlsProps) {
  const filterCount = activeTypes.size;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border border-border bg-surface/95 backdrop-blur-sm p-0.5">
        {([1, 2, 3] as const).map((d) => (
          <button
            key={d}
            onClick={() => onDepthChange(d)}
            className={cn(
              "h-7 w-7 rounded text-body-sm font-medium transition-colors",
              depth === d
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
            aria-pressed={depth === d}
            aria-label={`Depth ${d}`}
          >
            {d}
          </button>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-surface/95 backdrop-blur-sm">
            <Filter className="h-3.5 w-3.5" />
            Relations
            {filterCount > 0 && filterCount < availableTypes.length && (
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-mono text-primary">
                {filterCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by relation type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={activeTypes.has(type)}
              onCheckedChange={() => onToggleType(type)}
              onSelect={(e) => e.preventDefault()}
            >
              {RELATION_TYPE_LABELS[type]}
            </DropdownMenuCheckboxItem>
          ))}
          {filterCount > 0 && (
            <>
              <DropdownMenuSeparator />
              <button
                onClick={onResetTypes}
                className="w-full px-2 py-1.5 text-left text-body-sm text-muted-foreground hover:text-foreground"
              >
                Show all types
              </button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center rounded-md border border-border bg-surface/95 backdrop-blur-sm p-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomOut} aria-label="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onResetView} aria-label="Reset view">
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onZoomIn} aria-label="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
