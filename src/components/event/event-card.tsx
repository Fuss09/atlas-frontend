import Link from "next/link";
import { EventTypeIcon } from "@/components/event/event-type-icon";
import { ImportanceBadge } from "@/components/event/importance-badge";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EVENT_TYPE_META, type EventListItem } from "@/types";

interface EventCardProps {
  event: EventListItem;
  variant?: "timeline" | "compact";
  className?: string;
}

export function EventCard({ event, variant = "compact", className }: EventCardProps) {
  const meta = EVENT_TYPE_META[event.event_type];
  const iconColor =
    meta.sentiment === "positive"
      ? "text-success"
      : meta.sentiment === "negative"
        ? "text-danger"
        : "text-muted-foreground";

  if (variant === "timeline") {
    return (
      <div className={cn("flex gap-3 group", className)}>
        <div className="flex flex-col items-center">
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary", iconColor)}>
            <EventTypeIcon type={event.event_type} className="h-4 w-4" />
          </div>
          <div className="w-px flex-1 bg-border-subtle mt-2" />
        </div>
        <div className="flex-1 pb-6 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-body-sm font-medium text-foreground">{event.title}</p>
              <div className="flex items-center gap-2 mt-1 text-caption text-muted-foreground">
                <span>{meta.label}</span>
                <span>·</span>
                <span>{formatRelativeTime(event.occurred_at)}</span>
                <span>·</span>
                <span className="capitalize">{event.source}</span>
              </div>
            </div>
            <ImportanceBadge level={event.importance} />
          </div>
        </div>
      </div>
    );
  }

  // company_slug falls back to "" for an orphaned event (company
  // deleted after the event was recorded) — render as a non-link
  // rather than a broken /companies/ URL, same pattern established
  // for OpportunityCard in Sprint 4.
  const href = event.company_slug ? `/companies/${event.company_slug}` : null;

  const content = (
    <>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary", iconColor)}>
        <EventTypeIcon type={event.event_type} className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm text-foreground">{event.title}</p>
        <p className="text-caption text-muted-foreground truncate">
          {event.company_name} · {formatRelativeTime(event.occurred_at)}
        </p>
      </div>
    </>
  );

  const rowClassName = cn(
    "flex items-center gap-3 py-2.5 px-1 rounded-md transition-colors group",
    href && "hover:bg-secondary/50",
    className,
  );

  if (!href) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <Link href={href} className={rowClassName}>
      {content}
    </Link>
  );
}
