import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 md:px-6 md:py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="space-y-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
